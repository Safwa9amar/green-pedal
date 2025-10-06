import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Appbar, TextInput, Button, Text, Snackbar } from "react-native-paper";
import * as MailComposer from "expo-mail-composer";
import { useRouter } from "expo-router";

const SupportScreen = () => {
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleSendEmail = async () => {
    if (!subject || !message) {
      setSnackbarMessage("Please fill in both subject and message fields.");
      setVisible(true);
      return;
    }

    const isAvailable = await MailComposer.isAvailableAsync();
    if (!isAvailable) {
      setSnackbarMessage("Email service is not available on this device.");
      setVisible(true);
      return;
    }

    await MailComposer.composeAsync({
      recipients: ["support@greenpedal.com"],
      subject: subject,
      body: message,
    });

    setSnackbarMessage("Mail composer opened successfully.");
    setVisible(true);
    setSubject("");
    setMessage("");
  };

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.title}>Contact Green Pedal Support</Text>

        <Text style={styles.paragraph}>
          If you have questions, issues, or feedback about Green Pedal, please
          contact our support team. Fill in the subject and your message below,
          and we’ll respond as soon as possible.
        </Text>

        <TextInput
          label="Subject"
          value={subject}
          mode="outlined"
          onChangeText={setSubject}
          style={styles.input}
        />

        <TextInput
          label="Message"
          value={message}
          mode="outlined"
          multiline
          numberOfLines={10}
          onChangeText={setMessage}
          style={styles.input}
        />

        <Button
          mode="contained"
          onPress={handleSendEmail}
          style={styles.button}
          contentStyle={{ paddingVertical: 8 }}
          buttonColor="#A5D6A7"
          textColor="black"
        >
          Send Email
        </Button>

        <Text style={styles.note}>
          You can also reach us directly at{" "}
          <Text style={styles.email}>support@greenpedal.com</Text>
        </Text>
      </ScrollView>

      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={3000}
        style={styles.snackbar}
      >
        {snackbarMessage}
      </Snackbar>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    backgroundColor: "#FAFAFA",
    position: "absolute",
    top: 150,
    borderTopLeftRadius: 50,
  },
  content: {
    padding: 20,
    paddingLeft: 30,
    paddingTop: 50,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  paragraph: {
    fontSize: 15,
    color: "#444",
    marginBottom: 20,
    textAlign: "center",
    lineHeight: 22,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 10,
    marginBottom: 25,
  },
  note: {
    textAlign: "center",
    color: "#666",
    marginTop: 10,
  },
  email: {
    color: "#1E88E5",
    fontWeight: "600",
  },
  snackbar: {
    backgroundColor: "#43A047",
  },
});

export default SupportScreen;
