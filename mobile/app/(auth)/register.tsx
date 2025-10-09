import React, { useEffect } from "react";
import { Keyboard, View, Text, StyleSheet } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "expo-router";
// Removed Google Auth imports
import { register as apiRegister, login as apiLogin } from "@/src/api";
import { useAuthStore } from "@/src/store";

const RegisterScreen = () => {
  const router = useRouter();
  const { login } = useAuthStore();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
    setValue,
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const [apiMsg, setApiMsg] = React.useState<string | null>(null);

  const onSubmit = async (data: {
    name: string;
    email: string;
    password: string;
  }) => {
    Keyboard.dismiss();
    setApiMsg(null);
    try {
      const response = await apiRegister({
        username: data.name,
        name: data.name,
        email: data.email,
        password: data.password,
      });
      // If backend returns retry flag, show retry message and do not redirect
      if (response.data && response.data.retry) {
        setApiMsg(
          response.data.message ||
            "Failed to send confirmation email. Please try again."
        );
        return;
      }
      setApiMsg(
        (response.data && response.data.message) ||
          "Registration successful! Please verify your email."
      );
      setTimeout(() => {
        router.replace({
          pathname: "/verification",
          params: { email: data.email },
        });
      }, 1200);
    } catch (error: any) {
      let msg = "Registration failed. Please try again.";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        msg = error.response.data.message;
      }
      setApiMsg(msg);
    }
  };

  return (
    <View style={styles.formContainer}>
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
        name="name"
        rules={{
          required: "Name is required",
          minLength: {
            value: 2,
            message: "Name must be at least 2 characters",
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            mode="flat"
            label="Name"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            style={styles.input}
            error={!!errors.name}
          />
        )}
      />
      {errors.name && (
        <Text style={styles.errorText}>{errors.name.message}</Text>
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
        labelStyle={styles.buttonText}
        loading={isSubmitting}
        disabled={isSubmitting}
      >
        Sign up
      </Button>
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
    fontSize: 18,
    color: "#3A0A3A",
    textTransform: "none",
  },
  errorText: {
    color: "#FF3B5C",
    fontSize: 16,
    marginBottom: 8,
  },
});

export default RegisterScreen;
