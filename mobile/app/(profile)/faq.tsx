import React, { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { List, Text } from "react-native-paper";

export default function FAQScreen() {
  const [expanded, setExpanded] = useState<string | null>(null);

  const handlePress = (id: string) => {
    setExpanded(expanded === id ? null : id);
  };

  const faqData = [
    {
      id: "rent",
      title: "How do I rent a bike?",
      icon: "bike",
      items: [
        "Download the Green Pedal app",
        "Create an account and add balance",
        "Locate a nearby station on the map",
        "Scan the QR code on the bike to unlock it",
        "When finished, return the bike to any Green Pedal station",
      ],
    },
    {
      id: "cost",
      title: "How much does it cost to rent a bike?",
      icon: "currency-usd",
      items: [
        "Our basic rate is per minute of usage",
        "Special packages available for students and regular commuters",
      ],
    },
    {
      id: "damage",
      title: "What if the bike gets damaged during my ride?",
      icon: "alert-circle",
      items: [
        "Report any issues immediately through the app",
        "Take photos of the damage if possible",
        "Our team will assess and determine if any charges apply",
        "You are responsible only for misuse or negligence",
      ],
    },
    {
      id: "stations",
      title:
        "What happens if there are no available stations to return my bike?",
      icon: "map-marker",
      items: [
        "The app shows real-time availability",
        "If a station is full, you’ll be directed to the nearest one",
        "In emergencies, contact support through the app",
      ],
    },
    {
      id: "balance",
      title: "How do I add balance to my account?",
      icon: "wallet",
      items: [
        "Go to “Balance” in the app",
        "Select “Add Funds”",
        "Choose your preferred recharge amount",
        "Complete the transaction securely",
      ],
    },
    {
      id: "tech",
      title: "What if I have technical issues with the bike?",
      icon: "wrench",
      items: [
        "Report the issue immediately through the app",
        "End your ride if the bike is unusable and choose another",
        "You won’t be charged during the reporting time",
      ],
    },
    {
      id: "privacy",
      title: "Is my personal information secure?",
      icon: "shield-lock",
      items: [
        "We use strong encryption to protect your data",
        "Payments are securely processed",
        "We never sell your personal data",
        "See our Privacy Policy for full details",
      ],
    },
    {
      id: "pause",
      title: "Can I pause my ride?",
      icon: "pause-circle",
      items: [
        "Yes, use the app’s “Pause Ride” feature",
        "A reduced rate applies during paused time",
        "You remain responsible for the paused bike",
      ],
    },
    {
      id: "lost",
      title: "How do I report a lost or stolen bike?",
      icon: "lock-alert",
      items: [
        "Contact customer support immediately",
        "Provide details about when and where it was lost",
        "Our team will assist you with next steps",
      ],
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Common Questions About Green Pedal</Text>

      <List.Section>
        {faqData.map(({ id, title, icon, items }) => (
          <List.Accordion
            key={id}
            title={title}
            expanded={expanded === id}
            onPress={() => handlePress(id)}
            left={(props) => <List.Icon {...props} icon={icon} />}
          >
            {items.map((item, idx) => (
              <List.Item key={idx} title={`• ${item}`} titleNumberOfLines={2} />
            ))}
          </List.Accordion>
        ))}
      </List.Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    position: "fixed",
    borderTopLeftRadius: 50,
    width: "100%",
    height: "100%",
  },
  content: { padding: 20 },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
    color: "#4CAF50",
  },
});
