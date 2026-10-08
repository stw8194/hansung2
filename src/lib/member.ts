import { supabase } from "./supabase/client";
import { getSessionToken } from "./auth";
import type { ConsultationState } from "../types/consultation";
import type { ExpertVideo } from "../pages/Consulting/consultingData";
import { withDemoVideo } from "../pages/Consulting/consultingData";

export type ConsultationHistory = ConsultationState & { id: string; createdAt: string };
export type MemberDashboard = {
  nickname: string; loginId: string; photo: string | null; notifications: boolean;
  history: ConsultationHistory[]; savedVideos: ExpertVideo[];
};
export class MemberAuthError extends Error {
  constructor() { super("로그인이 필요합니다."); }
}

async function memberRpc<T>(name: string, args: Record<string, unknown> = {}): Promise<T> {
  const token = getSessionToken();
  if (!token) throw new MemberAuthError();
  const { data, error } = await supabase.rpc(name, { ...args, candidate_token: token });
  if (error) {
    if (error.message.includes("authentication required")) throw new MemberAuthError();
    if (error.message.includes("nickname already exists")) throw new Error("이미 사용 중인 닉네임입니다.");
    if (error.message.includes("invalid nickname")) throw new Error("닉네임은 2~30자로 입력해 주세요.");
    throw new Error("요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.");
  }
  return data as T;
}

export const getMemberDashboard = async () => {
  const data = await memberRpc<MemberDashboard>("get_member_dashboard");
  return { ...data, savedVideos: data.savedVideos.map(withDemoVideo) };
};
export const updateMemberProfile = (nickname: string, photo: string | null) => memberRpc<void>("update_member_profile", { candidate_nickname: nickname.trim(), candidate_photo: photo });
export const updateMemberPreferences = (notifications: boolean) => memberRpc<void>("update_member_preferences", { candidate_notifications: notifications });
export const setMemberSavedVideo = (videoId: string, saved: boolean) => memberRpc<void>("set_member_saved_video", { candidate_video_id: videoId, candidate_saved: saved });
export const saveMemberConsultation = (state: ConsultationState) => memberRpc<string>("save_member_consultation", { candidate_request_key: state.historyId, candidate_category: state.category, candidate_answers: state.answers });

export async function readProfilePhoto(file: File) {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) throw new Error("JPG, PNG, WEBP 사진을 선택해 주세요.");
  if (file.size > 10 * 1024 * 1024) throw new Error("사진은 10MB 이하로 선택해 주세요.");
  let bitmap: ImageBitmap;
  try { bitmap = await createImageBitmap(file); } catch { throw new Error("사진을 열지 못했습니다. 다른 사진을 선택해 주세요."); }
  try {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 256;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("사진을 처리하지 못했습니다.");
    const side = Math.min(bitmap.width, bitmap.height);
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, 256, 256);
    context.drawImage(bitmap, (bitmap.width - side) / 2, (bitmap.height - side) / 2, side, side, 0, 0, 256, 256);
    return canvas.toDataURL("image/jpeg", 0.85);
  } finally { bitmap.close(); }
}
