import { useAuthStore } from "@/src/store";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export function withIdCardCheck(WrappedComponent: React.ComponentType<any>) {
  return function (props: any) {
    const { user } = useAuthStore();
    const router = useRouter();
    useEffect(() => {
      if (user && !user.idCardVerified) {
        router.replace("/(auth)/id-card");
      }
    }, [user]);

    return <WrappedComponent {...props} />;
  };
}
