export interface ProfileModalProps {
  visible: boolean;
  onDismiss: () => void;
  newGoal: string;
  onChangeGoal: (goal: string) => void;
  onSave: () => void;
  isLoading?: boolean;
}