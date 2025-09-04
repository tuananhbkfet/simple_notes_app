"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export function SignInForm() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const loggedInUser = useQuery(api.auth.loggedInUser);

  // Nếu đã đăng nhập thì chuyển về dashboard
  if (loggedInUser) {
    navigate("/dashboard");
    return null;
  }

  return (
    <div className="w-full">
      <form
        className="flex flex-col gap-form-field"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitting(true);
          const formData = new FormData(e.target as HTMLFormElement);
          formData.set("flow", flow);
          void signIn("password", formData)
            .then(() => {
              // Đăng nhập thành công, chuyển đến dashboard
              toast.success("Đăng nhập thành công!");
              navigate("/dashboard");
            })
            .catch((error) => {
              let toastTitle = "";
              if (error.message.includes("Invalid password")) {
                toastTitle = "Mật khẩu không chính xác. Vui lòng thử lại.";
              } else {
                toastTitle =
                  flow === "signIn"
                    ? "Không thể đăng nhập, bạn muốn đăng ký tài khoản mới?"
                    : "Không thể đăng ký, bạn đã có tài khoản?";
              }
              toast.error(toastTitle);
              setSubmitting(false);
            });
        }}
      >
        <input
          className="auth-input-field"
          type="email"
          name="email"
          placeholder="Địa chỉ email"
          required
        />
        <input
          className="auth-input-field"
          type="password"
          name="password"
          placeholder="Mật khẩu"
          required
        />
        <button className="auth-button" type="submit" disabled={submitting}>
          {flow === "signIn" ? "Đăng nhập" : "Đăng ký"}
        </button>
        <div className="text-center text-sm text-secondary">
          <span>
            {flow === "signIn"
              ? "Chưa có tài khoản? "
              : "Đã có tài khoản? "}
          </span>
          <button
            type="button"
            className="text-primary hover:text-primary-hover hover:underline font-medium cursor-pointer"
            onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
          >
            {flow === "signIn" ? "Đăng ký ngay" : "Đăng nhập ngay"}
          </button>
        </div>
      </form>

      <div className="flex items-center justify-center my-3">
        <hr className="my-4 grow border-gray-200" />
        <span className="mx-4 text-secondary">Cần hỗ trợ?</span>
        <hr className="my-4 grow border-gray-200" />
      </div>
      
      <div className="flex flex-col items-center space-y-4">
        <p className="text-center text-gray-700">Liên hệ với chúng tôi</p>
        
        <div className="flex items-center space-x-6">
          {/* Liên hệ qua điện thoại */}
          <a 
            href="tel:0976668458" 
            className="flex flex-col items-center text-gray-700 hover:text-blue-600 transition-colors"
            title="Gọi điện thoại"
          >
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 8V5z" />
              </svg>
            </div>
            <span className="text-sm">Điện thoại</span>
          </a>
          
          {/* Liên hệ qua Zalo */}
          <a 
            href="https://zalo.me/0976668458" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex flex-col items-center text-gray-700 hover:text-blue-600 transition-colors"
            title="Nhắn tin Zalo"
          >
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-1">
              {/* Zalo icon (simplified version) */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.49 10.272v-.45h1.347v6.322h-1.347v-.459c-.33.357-.721.54-1.167.54-.486 0-.919-.18-1.299-.54-.379-.36-.569-.797-.569-1.313v-3.328c0-.516.19-.968.57-1.313.38-.378.822-.558 1.316-.558.437 0 .828.183 1.149.54zm-.765 1.464a.532.532 0 00-.468-.27.574.574 0 00-.486.27.947.947 0 00-.198.594v2.227c0 .234.066.432.198.594a.574.574 0 00.486.27.532.532 0 00.468-.27.913.913 0 00.18-.594v-2.227a.913.913 0 00-.18-.594z"/>
                <path d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10c-.597 0-1.254-.055-1.755-.165a.981.981 0 00-.653.09c-.913.586-1.673.657-2.142.618a.38.38 0 01-.33-.45.331.331 0 01.088-.151 3.02 3.02 0 00.839-1.353.376.376 0 00-.038-.325A8.02 8.02 0 012 12zm4.06-.36h1.457v4.353H6.06v-4.354H4.665V10.46H6.06V9.434c0-.686.228-1.255.683-1.707.455-.453 1.023-.68 1.705-.68h1.275v1.453h-.931c-.345 0-.517.173-.517.518v1.443h1.448v1.452H8.275v4.354z"/>
              </svg>
            </div>
            <span className="text-sm">Zalo</span>
          </a>
        </div>
      </div>
    </div>
  );
}
