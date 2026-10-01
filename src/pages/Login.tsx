import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getAppSession, signIn, signUp } from "../lib/auth";
import { supabase } from "../lib/supabase/client";

type LoginState = { from?: string } | null;
type CheckState = "idle" | "checking" | "available" | "taken";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const routeState = location.state as LoginState;
  const destination = routeState?.from?.startsWith("/") ? routeState.from : "/";
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [nickname, setNickname] = useState("");
  const [loginIdCheck, setLoginIdCheck] = useState<CheckState>("idle");
  const [nicknameCheck, setNicknameCheck] = useState<CheckState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    void getAppSession().then((session) => {
      if (session) navigate(destination, { replace: true });
    });
  }, [destination, navigate]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (mode === "login") {
        await signIn(loginId.trim(), password);
        navigate(destination, { replace: true });
        return;
      }

      if (!isValidLoginId(loginId))
        throw new Error("아이디는 영문, 숫자, 밑줄로 4~20자 입력해 주세요.");
      if (nickname.trim().length < 2)
        throw new Error("닉네임은 2자 이상 입력해 주세요.");
      if (loginIdCheck !== "available" || nicknameCheck !== "available") {
        throw new Error("아이디와 닉네임 중복확인을 모두 완료해 주세요.");
      }
      if (
        password.length < 8 ||
        !/[A-Za-z]/.test(password) ||
        !/\d/.test(password)
      ) {
        throw new Error(
          "비밀번호는 영문과 숫자를 포함해 8자 이상 입력해 주세요.",
        );
      }

      await signUp(loginId.trim(), nickname.trim(), password);
      navigate(destination, { replace: true });
    } catch (submitError) {
      setError(getAuthErrorMessage(submitError));
    } finally {
      setSubmitting(false);
    }
  };

  const changeMode = (nextMode: "login" | "signup") => {
    setMode(nextMode);
    setError(null);
  };

  const checkAvailability = async (target: "loginId" | "nickname") => {
    const trimmedLoginId = loginId.trim();
    const trimmedNickname = nickname.trim();
    if (target === "loginId" && !isValidLoginId(trimmedLoginId)) {
      setError("아이디는 영문, 숫자, 밑줄로 4~20자 입력해 주세요.");
      return;
    }
    if (target === "nickname" && trimmedNickname.length < 2) {
      setError("닉네임은 2자 이상 입력해 주세요.");
      return;
    }

    setError(null);
    if (target === "loginId") setLoginIdCheck("checking");
    else setNicknameCheck("checking");
    const { data, error: checkError } = await supabase.rpc(
      "check_signup_availability",
      {
        candidate_login_id: trimmedLoginId || "unused_login_id",
        candidate_nickname: trimmedNickname || "사용하지않는닉네임",
      },
    );
    if (checkError || !data) {
      if (target === "loginId") setLoginIdCheck("idle");
      else setNicknameCheck("idle");
      setError(
        "중복확인을 완료하지 못했습니다. 최신 DB SQL을 적용했는지 확인해 주세요.",
      );
      return;
    }

    const result = data as {
      login_id_available: boolean;
      nickname_available: boolean;
    };
    if (target === "loginId")
      setLoginIdCheck(result.login_id_available ? "available" : "taken");
    else setNicknameCheck(result.nickname_available ? "available" : "taken");
  };

  return (
    <main className="grid flex-1 place-items-center bg-[#f7f9fc] px-4 py-14 text-left">
      <section className="w-full max-w-[430px] rounded-2xl border border-[#e3e8ef] bg-white px-9 py-9 shadow-[0_18px_55px_rgba(15,23,42,0.08)] max-[520px]:px-6">
        <Link
          className="text-[13px] font-bold text-[#7a8595] no-underline hover:text-[#1859dc]"
          to="/"
        >
          ← 홈으로
        </Link>
        <h1 className="mt-7 text-[30px] font-black tracking-[-0.04em] text-[#172033]">
          {mode === "login" ? "로그인" : "회원가입"}
        </h1>
        <p className="mt-2 text-[13px] text-[#8b95a4]">
          {mode === "login"
            ? "로그인하고 맞춤 서비스를 이용해 보세요."
            : "서비스에서 사용할 계정을 만들어 주세요."}
        </p>

        <div className="mt-7 grid grid-cols-2 rounded-lg bg-[#f2f5f8] p-1">
          <ModeButton
            active={mode === "login"}
            onClick={() => changeMode("login")}
          >
            로그인
          </ModeButton>
          <ModeButton
            active={mode === "signup"}
            onClick={() => changeMode("signup")}
          >
            회원가입
          </ModeButton>
        </div>

        <form className="mt-6 grid gap-5" onSubmit={submit}>
          <Field label="아이디">
            {mode === "signup" ? (
              <CheckControl
                check={loginIdCheck}
                input={
                  <input
                    className={inputClass}
                    autoComplete="username"
                    maxLength={20}
                    placeholder="영문, 숫자, 밑줄 4~20자"
                    required
                    value={loginId}
                    onChange={(event) => {
                      setLoginId(event.target.value);
                      setLoginIdCheck("idle");
                    }}
                  />
                }
                onCheck={() => void checkAvailability("loginId")}
              />
            ) : (
              <input
                className={inputClass}
                autoComplete="username"
                placeholder="아이디 입력"
                required
                value={loginId}
                onChange={(event) => setLoginId(event.target.value)}
              />
            )}
          </Field>
          {mode === "signup" && (
            <Field label="닉네임">
              <CheckControl
                check={nicknameCheck}
                input={
                  <input
                    className={inputClass}
                    maxLength={30}
                    placeholder="서비스에서 사용할 이름"
                    required
                    value={nickname}
                    onChange={(event) => {
                      setNickname(event.target.value);
                      setNicknameCheck("idle");
                    }}
                  />
                }
                onCheck={() => void checkAvailability("nickname")}
              />
            </Field>
          )}
          <Field label="비밀번호">
            <div className="relative">
              <input
                className={`${inputClass} pr-12`}
                autoComplete={
                  mode === "login" ? "current-password" : "new-password"
                }
                minLength={mode === "login" ? 1 : 8}
                placeholder={
                  mode === "login" ? "비밀번호 입력" : "영문·숫자 포함 8자 이상"
                }
                required
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <button
                className="absolute top-1/2 right-3 grid size-8 -translate-y-1/2 cursor-pointer place-items-center rounded-md border-0 bg-transparent text-[#8b95a4] hover:bg-[#f2f5f8] hover:text-[#1859dc]"
                type="button"
                aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                aria-pressed={showPassword}
                onClick={() => setShowPassword((visible) => !visible)}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </Field>
          {error && (
            <p className="text-[13px] font-semibold text-red-500">{error}</p>
          )}
          <button
            className="mt-1 h-12 cursor-pointer rounded-lg border-0 bg-[#1859dc] text-[14px] font-bold text-white transition hover:bg-[#1049bd] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={submitting}
            type="submit"
          >
            {submitting
              ? "처리 중..."
              : mode === "login"
                ? "로그인"
                : "가입하기"}
          </button>
        </form>
      </section>
    </main>
  );
}

const inputClass =
  "h-12 w-full rounded-lg border border-[#dfe5ec] px-3.5 text-[14px] text-[#263143] outline-none transition placeholder:text-[#b1b8c2] focus:border-[#1859dc]";

function isValidLoginId(loginId: string) {
  return /^[A-Za-z0-9_]{4,20}$/.test(loginId.trim());
}

function getAuthErrorMessage(error: unknown) {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "object" && error !== null && "message" in error
        ? String(error.message)
        : String(error);
  const normalized = message.toLowerCase();
  if (normalized.includes("invalid login credentials"))
    return "아이디 또는 비밀번호를 확인해 주세요.";
  if (normalized.includes("login id already exists"))
    return "이미 사용 중인 아이디입니다.";
  if (normalized.includes("nickname already exists"))
    return "이미 사용 중인 닉네임입니다.";
  if (normalized.includes("invalid login id"))
    return "아이디는 영문, 숫자, 밑줄로 4~20자 입력해 주세요.";
  if (normalized.includes("invalid password"))
    return "비밀번호는 영문과 숫자를 포함해 8자 이상 입력해 주세요.";
  if (normalized.includes("invalid nickname"))
    return "닉네임은 2~30자 입력해 주세요.";
  return message || "요청을 처리하지 못했습니다.";
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2 text-[12px] font-bold text-[#596678]">
      <span>{label}</span>
      {children}
    </label>
  );
}

function ModeButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      className={`h-9 cursor-pointer rounded-md border-0 text-[13px] font-bold transition ${active ? "bg-white text-[#172033] shadow-sm" : "bg-transparent text-[#8b95a4]"}`}
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function CheckControl({
  check,
  input,
  onCheck,
}: {
  check: CheckState;
  input: React.ReactNode;
  onCheck: () => void;
}) {
  return (
    <div>
      <div className="flex gap-2">
        <div className="min-w-0 flex-1">{input}</div>
        <button
          className="w-[82px] shrink-0 cursor-pointer rounded-lg border border-[#d7dee7] bg-white text-[12px] font-bold text-[#536072] hover:border-[#1859dc] hover:text-[#1859dc] disabled:cursor-wait disabled:opacity-60"
          disabled={check === "checking"}
          type="button"
          onClick={onCheck}
        >
          {check === "checking" ? "확인 중" : "중복확인"}
        </button>
      </div>
      {check === "available" && (
        <p className="mt-1.5 text-[11px] font-semibold text-emerald-600">
          사용할 수 있습니다.
        </p>
      )}
      {check === "taken" && (
        <p className="mt-1.5 text-[11px] font-semibold text-red-500">
          이미 사용 중입니다.
        </p>
      )}
    </div>
  );
}

function EyeIcon() {
  return (
    <svg
      className="size-[18px] fill-none stroke-current stroke-[1.8]"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      className="size-[18px] fill-none stroke-current stroke-[1.8]"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="m3 3 18 18" />
      <path d="M10.6 6.2A10.8 10.8 0 0 1 12 6c6 0 9.5 6 9.5 6a17 17 0 0 1-2.2 2.8M6.2 6.2C3.8 7.8 2.5 12 2.5 12s3.5 6 9.5 6a9.8 9.8 0 0 0 3.1-.5" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </svg>
  );
}
