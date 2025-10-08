import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { View, StyleSheet, Image, Keyboard } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { useAuthStore } from "@/src/store";
import { login as apiLogin, getProfile } from "@/api";
import { useForm, Controller } from "react-hook-form";

const LoginScreen = () => {
  const router = useRouter();
  const { login, isAuthenticated, setToken, setRefreshToken } = useAuthStore();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { email: "", password: "" },
    mode: "onTouched",
  });

  const [apiMsg, setApiMsg] = React.useState<string | null>(null);
  const onSubmit = async (data: { email: string; password: string }) => {
    setApiMsg(null);
    Keyboard.dismiss();

    try {
      const response = await apiLogin({
        email: data.email,
        password: data.password,
      });
      // If login is successful
      const { accessToken, refreshToken } = response.data || response;

      if (accessToken && refreshToken) {
        setToken(accessToken);
        setRefreshToken(refreshToken);
        const profileRes = await getProfile();
        if (profileRes.status === 200) {
          const user = profileRes.data;
          login(user, accessToken);
        }
        return;
      }
    } catch (error: any) {
      // If backend says verification is required, redirect to verification page
      if (
        error.response &&
        error.response.data &&
        error.response.data.requireVerification &&
        error.response.data.email
      ) {
        setApiMsg(error.response.data.message || "Please verify your email.");
        setTimeout(() => {
          router.replace({
            pathname: "/verification",
            params: { email: error.response.data.email },
          });
        }, 1200);
        return;
      }
      let msg = "Login failed. Please try again.";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        msg = error.response.data.message;
      }
      setApiMsg(msg);
      console.error("Login failed", error);
    }
  };

  useEffect(() => {
    isAuthenticated && router.push("/");
  }, [isAuthenticated]);

  return (
    <View style={styles.formContainer}>
      <Image
        alt="logo"
        style={{ width: 200, height: 200, alignSelf: "center" }}
        source={require("@/assets/images/logo.png")}
      />
      {apiMsg && <Text style={styles.errorText}>{apiMsg}</Text>}
      <Controller
        control={control}
        name="email"
        rules={{
          required: "Email is required",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Invalid email address",
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            mode="flat"
            label="Email"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            autoCapitalize="none"
            style={styles.input}
            error={!!errors.email}
          />
        )}
      />
      {errors.email && (
        <Text style={styles.errorText}>{errors.email.message}</Text>
      )}
      <Controller
        control={control}
        name="password"
        rules={{
          required: "Password is required",
          minLength: {
            value: 6,
            message: "Password must be at least 6 characters",
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            mode="flat"
            label="Password"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            secureTextEntry
            style={styles.input}
            error={!!errors.password}
          />
        )}
      />
      {errors.password && (
        <Text style={styles.errorText}>{errors.password.message}</Text>
      )}
      <Button
        mode="contained"
        onPress={handleSubmit(onSubmit)}
        style={styles.button}
        theme={{ colors: { primary: "#00F5FF" } }}
        loading={isSubmitting}
        disabled={isSubmitting}
      >
        Log in
      </Button>
      {!isSubmitting && (
        <Text
          style={{
            marginTop: 12,
            textAlign: "center",
            color: "#888",
            fontSize: 15,
            textDecorationLine: "underline",
          }}
          onPress={() => router.push("/forgot-password")}
        >
          Forgot password?
        </Text>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
    borderTopStartRadius: 50,
    padding: 32,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  input: {
    fontSize: 18,
    marginBottom: 16,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  button: {
    borderRadius: 40,
    marginTop: 10,
    paddingVertical: 2,
  },
  buttonText: {
    fontSize: 16,
    color: "#3A0A3A",
    textTransform: "none",
  },
  errorText: {
    color: "#FF3B5C",
    fontSize: 16,
    marginBottom: 8,
  },
});

export default LoginScreen;
