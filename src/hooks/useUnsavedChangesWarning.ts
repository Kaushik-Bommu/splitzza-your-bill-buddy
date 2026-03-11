import { useEffect, useCallback, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

interface UseUnsavedChangesWarningReturn {
  isModalOpen: boolean;
  confirmNavigation: () => void;
  cancelNavigation: () => void;
  navigateAway: (to: string | number) => void;
  showConfirmation: () => void;
}

/**
 * Hook to show an unsaved changes warning when users try to leave a page with unsaved changes.
 * 
 * @param isDirty - Whether the page has unsaved changes
 * @returns Object with modal state and navigation control functions
 */
export function useUnsavedChangesWarning(isDirty: boolean): UseUnsavedChangesWarningReturn {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pendingNavigationRef = useRef<string | null>(null);

  // Handle browser refresh/close warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const confirmNavigation = useCallback(() => {
    const targetPath = pendingNavigationRef.current;
    setIsModalOpen(false);
    pendingNavigationRef.current = null;
    if (targetPath) {
      if (targetPath === "-1") {
        navigate(-1);
      } else {
        navigate(targetPath);
      }
    }
  }, [navigate]);

  const cancelNavigation = useCallback(() => {
    setIsModalOpen(false);
    pendingNavigationRef.current = null;
  }, []);

  const showConfirmation = useCallback(() => {
    if (isDirty) {
      pendingNavigationRef.current = "-1";
      setIsModalOpen(true);
    }
  }, [isDirty]);

  const navigateAway = useCallback(
    (to: string | number) => {
      if (isDirty) {
        pendingNavigationRef.current = String(to);
        setIsModalOpen(true);
      } else {
        navigate(to as Parameters<typeof navigate>[0]);
      }
    },
    [isDirty, navigate]
  );

  return {
    isModalOpen,
    confirmNavigation,
    cancelNavigation,
    navigateAway,
    showConfirmation,
  };
}

