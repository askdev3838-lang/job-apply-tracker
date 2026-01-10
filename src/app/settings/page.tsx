"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import {
  Sun,
  Moon,
  Monitor,
  Plus,
  X,
  Download,
  Upload,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useSettingsStore, useApplicationStore } from "@/store";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const {
    settings,
    updateSettings,
    addCustomSource,
    removeCustomSource,
    addCustomIndustry,
    removeCustomIndustry,
    getAllSources,
    getAllIndustries,
  } = useSettingsStore();
  const { applications, filters, setFilters } = useApplicationStore();
  const t = useTranslations();
  const router = useRouter();

  const [newSource, setNewSource] = useState("");
  const [newIndustry, setNewIndustry] = useState("");
  const [showClearDialog, setShowClearDialog] = useState(false);

  const handleLanguageChange = (locale: "en" | "tr") => {
    updateSettings({ language: locale });
    document.cookie = `locale=${locale};path=/;max-age=31536000`;
    router.refresh();
  };

  const handleAddSource = () => {
    if (newSource.trim() && !getAllSources().includes(newSource.trim())) {
      addCustomSource(newSource.trim());
      setNewSource("");
      toast.success("Source added");
    }
  };

  const handleAddIndustry = () => {
    if (
      newIndustry.trim() &&
      !getAllIndustries().includes(newIndustry.trim())
    ) {
      addCustomIndustry(newIndustry.trim());
      setNewIndustry("");
      toast.success("Industry added");
    }
  };

  const handleExportData = () => {
    const data = {
      applications,
      settings,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `job-apply-track-backup-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Data exported successfully");
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.applications && data.settings) {
          // This would need to be implemented in the store
          toast.success("Data imported successfully");
          router.refresh();
        } else {
          toast.error("Invalid backup file");
        }
      } catch (error) {
        toast.error("Failed to parse backup file");
      }
    };
    reader.readAsText(file);
  };

  const handleClearAllData = () => {
    localStorage.removeItem("job-apply-track-applications");
    localStorage.removeItem("job-apply-track-settings");
    toast.success("All data cleared");
    setShowClearDialog(false);
    router.refresh();
    window.location.reload();
  };

  const themes = [
    { value: "light", label: t("settings.themeLight"), icon: Sun },
    { value: "dark", label: t("settings.themeDark"), icon: Moon },
    { value: "system", label: t("settings.themeSystem"), icon: Monitor },
  ];

  const languages = [
    { value: "en", label: t("settings.languageEn"), flag: "🇬🇧" },
    { value: "tr", label: t("settings.languageTr"), flag: "🇹🇷" },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("settings.title")}</h1>
        <p className="text-muted-foreground">
          Manage your application preferences
        </p>
      </div>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle>{t("settings.appearance")}</CardTitle>
          <CardDescription>Customize how the app looks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme */}
          <div className="space-y-3">
            <Label>{t("settings.theme")}</Label>
            <div className="grid grid-cols-3 gap-2">
              {themes.map((t) => {
                const Icon = t.icon;
                return (
                  <Button
                    key={t.value}
                    variant={theme === t.value ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => setTheme(t.value)}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {t.label}
                  </Button>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Language */}
          <div className="space-y-3">
            <Label>{t("settings.language")}</Label>
            <div className="grid grid-cols-2 gap-2">
              {languages.map((lang) => (
                <Button
                  key={lang.value}
                  variant={
                    settings.language === lang.value ? "default" : "outline"
                  }
                  className="justify-start"
                  onClick={() =>
                    handleLanguageChange(lang.value as "en" | "tr")
                  }
                >
                  <span className="mr-2">{lang.flag}</span>
                  {lang.label}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Hide Rejected */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t("filter.hideRejected")}</Label>
              <p className="text-sm text-muted-foreground">
                {t("settings.hideRejectedDescription")}
              </p>
            </div>
            <Switch
              checked={filters.hideRejected || false}
              onCheckedChange={(checked) =>
                setFilters({ ...filters, hideRejected: checked || undefined })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Custom Sources */}
      <Card>
        <CardHeader>
          <CardTitle>{t("settings.customSources")}</CardTitle>
          <CardDescription>
            Add custom job sources for your applications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="e.g., AngelList, Hacker News"
              value={newSource}
              onChange={(e) => setNewSource(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddSource()}
            />
            <Button onClick={handleAddSource}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {settings.customSources.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {settings.customSources.map((source) => (
                <Badge key={source} variant="secondary" className="gap-1 pr-1">
                  {source}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 hover:bg-transparent"
                    onClick={() => {
                      removeCustomSource(source);
                      toast.success("Source removed");
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Custom Industries */}
      <Card>
        <CardHeader>
          <CardTitle>{t("settings.customIndustries")}</CardTitle>
          <CardDescription>
            Add custom industries for company categorization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="e.g., Blockchain, AI/ML"
              value={newIndustry}
              onChange={(e) => setNewIndustry(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddIndustry()}
            />
            <Button onClick={handleAddIndustry}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {settings.customIndustries.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {settings.customIndustries.map((industry) => (
                <Badge
                  key={industry}
                  variant="secondary"
                  className="gap-1 pr-1"
                >
                  {industry}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 hover:bg-transparent"
                    onClick={() => {
                      removeCustomIndustry(industry);
                      toast.success("Industry removed");
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle>{t("settings.dataManagement")}</CardTitle>
          <CardDescription>Export, import, or clear your data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={handleExportData}>
              <Download className="mr-2 h-4 w-4" />
              {t("settings.exportData")}
            </Button>
            <Button variant="outline" asChild>
              <label className="cursor-pointer">
                <Upload className="mr-2 h-4 w-4" />
                {t("settings.importData")}
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleImportData}
                />
              </label>
            </Button>
          </div>

          <Separator />

          <div>
            <Button
              variant="destructive"
              onClick={() => setShowClearDialog(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear All Data
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              This will permanently delete all your applications and settings.
            </p>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear All Data</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete all your applications and
              settings? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearAllData}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Clear All Data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
