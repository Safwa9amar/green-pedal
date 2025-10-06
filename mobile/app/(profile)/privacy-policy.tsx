import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text, Appbar, Divider } from "react-native-paper";

const PrivacyPolicy = () => {
  const navigation = useNavigation();

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.sectionTitle}>Introduction</Text>
        <Text style={styles.paragraph}>
          This Privacy Policy describes how Green Pedal ("we," "our," or "us")
          collects, uses, and discloses your information when you use our mobile
          bike-sharing platform, including our mobile application and web-based
          admin dashboard (collectively, the "Service").
        </Text>

        <Divider style={styles.divider} />

        <Text style={styles.sectionTitle}>Information We Collect</Text>
        <Text style={styles.subTitle}>Personal Information:</Text>
        <Text style={styles.listItem}>
          • Account information (name, email, phone, password)
        </Text>
        <Text style={styles.listItem}>
          • Profile information (including optional profile images)
        </Text>
        <Text style={styles.listItem}>
          • Payment details for balance recharges
        </Text>
        <Text style={styles.listItem}>• Location data while using the app</Text>
        <Text style={styles.listItem}>
          • Device information (type, OS, unique identifiers)
        </Text>

        <Text style={styles.subTitle}>Usage Information:</Text>
        <Text style={styles.listItem}>
          • Ride history and rental information
        </Text>
        <Text style={styles.listItem}>
          • App usage patterns and interactions
        </Text>
        <Text style={styles.listItem}>• QR code scanning activity</Text>
        <Text style={styles.listItem}>• Balance and recharge history</Text>

        <Divider style={styles.divider} />

        <Text style={styles.sectionTitle}>How We Use Your Information</Text>
        <Text style={styles.listItem}>
          • Create and manage your Green Pedal account
        </Text>
        <Text style={styles.listItem}>
          • Process ride rentals and balance recharges
        </Text>
        <Text style={styles.listItem}>
          • Provide real-time bike and station availability
        </Text>
        <Text style={styles.listItem}>• Improve and optimize our services</Text>
        <Text style={styles.listItem}>
          • Communicate about your account, rides, and support
        </Text>
        <Text style={styles.listItem}>
          • Prevent fraud and enhance security
        </Text>

        <Divider style={styles.divider} />

        <Text style={styles.sectionTitle}>Data Sharing and Disclosure</Text>
        <Text style={styles.paragraph}>
          We may share your information with:
        </Text>
        <Text style={styles.listItem}>
          • Service providers (payment, hosting, analytics)
        </Text>
        <Text style={styles.listItem}>
          • Law enforcement when required by law
        </Text>
        <Text style={styles.listItem}>
          • City partners operating bike stations (aggregated data)
        </Text>
        <Text style={styles.paragraph}>
          We do not sell your personal information to third parties.
        </Text>

        <Divider style={styles.divider} />

        <Text style={styles.sectionTitle}>Data Security</Text>
        <Text style={styles.paragraph}>
          We implement reasonable security measures to protect your personal
          information. However, no method of transmission or storage is 100%
          secure.
        </Text>

        <Divider style={styles.divider} />

        <Text style={styles.sectionTitle}>Your Rights and Choices</Text>
        <Text style={styles.listItem}>• Access your personal information</Text>
        <Text style={styles.listItem}>• Correct inaccurate information</Text>
        <Text style={styles.listItem}>• Delete your account and data</Text>
        <Text style={styles.listItem}>
          • Restrict or object to data processing
        </Text>
        <Text style={styles.listItem}>
          • Request a copy of your personal data
        </Text>
        <Text style={styles.paragraph}>
          To exercise these rights, please contact us at the email below.
        </Text>

        <Divider style={styles.divider} />

        <Text style={styles.sectionTitle}>Location Data</Text>
        <Text style={styles.paragraph}>
          Our app collects location data to show nearby bike stations. You can
          disable location services in your device settings, but this may limit
          certain features.
        </Text>

        <Divider style={styles.divider} />

        <Text style={styles.sectionTitle}>Data Retention</Text>
        <Text style={styles.paragraph}>
          We retain your data as long as necessary to provide our services and
          comply with laws. If you delete your account, we remove or anonymize
          your personal data, except where retention is required for legal
          purposes.
        </Text>

        <Divider style={styles.divider} />

        <Text style={styles.sectionTitle}>Changes to this Policy</Text>
        <Text style={styles.paragraph}>
          We may update this Privacy Policy periodically. We will notify you of
          major changes by updating this page and revising the "Last Updated"
          date.
        </Text>

        <Divider style={styles.divider} />

        <Text style={styles.sectionTitle}>Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have questions or concerns, please contact us at:
        </Text>
        <Text style={styles.email}>privacy@greenpedal.com</Text>

        <Text style={styles.footer}>Last Updated: October 5, 2025</Text>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    position: "fixed",
    borderTopLeftRadius: 50,
  },
  content: {
    padding: 20,
    paddingLeft: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
    color: "#444",
  },
  listItem: {
    fontSize: 15,
    lineHeight: 22,
    color: "#555",
    marginLeft: 10,
  },
  divider: {
    marginVertical: 15,
  },
  email: {
    color: "#1E88E5",
    textAlign: "center",
    marginTop: 10,
    fontWeight: "500",
  },
  footer: {
    textAlign: "center",
    marginTop: 20,
    marginBottom: 50,
    color: "#777",
  },
});

export default PrivacyPolicy;
