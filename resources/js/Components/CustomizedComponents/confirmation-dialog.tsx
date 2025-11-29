import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { useState } from "react";
import { toast_info } from "@/types/my_types/mytoast";

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (programCode: string) => void;
    dialog_title: string;
    dialog_label: string;
    placeholder: string;
    dialog_description: string;
    userTheme: "dark" | "light" | "system";
}

export function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    dialog_title,
    dialog_label,
    placeholder,
    dialog_description,
    userTheme,
}: ConfirmDialogProps) {
    const [confirmationCode, setConfirmationCode] = useState("");

    const handleConfirm = () => {
        onConfirm(confirmationCode);
        setConfirmationCode("");
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{dialog_title}</DialogTitle>
                    <DialogDescription>
                        Make changes to the {dialog_description}. Click confirm
                        when you're done.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Label htmlFor="confirmation_code">{dialog_label}</Label>
                    <Input
                        id="confirmation_code"
                        value={confirmationCode}
                        placeholder={placeholder}
                        autoComplete="off"
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d{0,4}$/.test(value)) {
                                setConfirmationCode(e.target.value);
                            }
                        }}
                        onBlur={(e) => {
                            const value = e.target.value;
                            if (value.length !== 4) {
                                toast_info({
                                    message:
                                        "Please enter exactly 4 digits for the academic year.",
                                    userTheme: userTheme,
                                });
                            }
                        }}
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm}>Confirm</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
