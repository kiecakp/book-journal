import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../theme/ThemeContext";

export interface DropdownOption<T extends string> {
  value: T;
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

interface DropdownProps<T extends string> {
  label: string;
  value: T;
  options: DropdownOption<T>[];
  onChange: (value: T) => void;
}

export default function Dropdown<T extends string>({
  label,
  value,
  options,
  onChange,
}: DropdownProps<T>) {
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);
  const styles = useMemo(() => createStyles(colors), [colors]);

  const selected = options.find((o) => o.value === value);

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.trigger} onPress={() => setOpen(true)}>
        {selected?.icon && (
          <Ionicons
            name={selected.icon}
            size={16}
            color={colors.primary}
            style={styles.triggerIcon}
          />
        )}
        <Text style={styles.triggerText}>{selected?.label ?? ""}</Text>
        <Ionicons name="chevron-down" size={16} color={colors.textMuted} />
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={styles.sheet}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => {
                const isSelected = item.value === value;
                return (
                  <TouchableOpacity
                    style={[styles.option, isSelected && styles.optionSelected]}
                    onPress={() => {
                      onChange(item.value);
                      setOpen(false);
                    }}
                  >
                    {item.icon && (
                      <Ionicons
                        name={item.icon}
                        size={18}
                        color={isSelected ? colors.primary : colors.textMuted}
                        style={styles.optionIcon}
                      />
                    )}
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.optionTextSelected,
                      ]}
                    >
                      {item.label}
                    </Text>
                    {isSelected && (
                      <Ionicons
                        name="checkmark"
                        size={18}
                        color={colors.primary}
                      />
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

function createStyles(colors: ReturnType<typeof useTheme>["colors"]) {
  return StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 14,
      paddingHorizontal: 16,
    },
    label: { fontSize: 15, fontWeight: "600", color: colors.textPrimary },
    trigger: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 10,
      backgroundColor: colors.primaryLight,
      gap: 6,
    },
    triggerIcon: { marginRight: -2 },
    triggerText: { fontSize: 14, fontWeight: "600", color: colors.primary },
    backdrop: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.35)",
      justifyContent: "center",
      paddingHorizontal: 32,
    },
    sheet: {
      backgroundColor: colors.background,
      borderRadius: 14,
      paddingVertical: 6,
      borderWidth: 1,
      borderColor: colors.borderLight,
      maxHeight: 320,
    },
    option: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      paddingHorizontal: 16,
      gap: 10,
    },
    optionSelected: { backgroundColor: colors.primaryLight },
    optionIcon: { marginRight: -4 },
    optionText: { flex: 1, fontSize: 15, color: colors.textPrimary },
    optionTextSelected: { fontWeight: "700", color: colors.primary },
  });
}
