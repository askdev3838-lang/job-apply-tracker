"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, FileX, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApplicationStore } from "@/store";
import { useTranslations } from "next-intl";
import { ApplicationCard } from "./application-card";
import { SearchBar } from "./search-bar";
import { FilterModal } from "./filter-modal";
import { SortDropdown } from "./sort-dropdown";
import { StatusFilter } from "./status-filter";
import { Skeleton } from "@/components/ui/skeleton";
import { KanbanBoard } from "./kanban-board";

const VIEW_MODE_STORAGE_KEY = "job-apply-view-mode";

function ApplicationCardSkeleton() {
  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-56" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="flex gap-4">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );
}

export function ApplicationsList() {
  const {
    getFilteredApplications,
    applications,
    _hasHydrated,
    fetchApplications,
    isLoading,
  } = useApplicationStore();
  const t = useTranslations();
  const [viewMode, setViewMode] = useState<"list" | "kanban">(() => {
    if (typeof window === "undefined") return "list";
    const stored = window.localStorage.getItem(VIEW_MODE_STORAGE_KEY);
    return stored === "kanban" ? "kanban" : "list";
  });

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const filteredApplications = getFilteredApplications();
  const pinnedCount = applications.filter((app) => app.isPinned).length;

  const toggleViewMode = () => {
    const nextMode = viewMode === "list" ? "kanban" : "list";
    setViewMode(nextMode);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(VIEW_MODE_STORAGE_KEY, nextMode);
    }
  };

  // Show skeleton while loading
  if (!_hasHydrated || isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <Skeleton className="h-8 w-40 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Skeleton className="h-10 flex-1" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-20" />
          </div>
        </div>
        <div className="grid gap-4">
          <ApplicationCardSkeleton />
          <ApplicationCardSkeleton />
          <ApplicationCardSkeleton />
        </div>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-16 h-16 mb-4 rounded-full bg-muted flex items-center justify-center">
          <FileX className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold mb-2">{t("empty.title")}</h2>
        <p className="text-muted-foreground mb-6 max-w-sm">
          {t("empty.description")}
        </p>
        <Link href="/applications/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t("empty.action")}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {t("application.applications")}
          </h1>
          <p className="text-muted-foreground text-sm">
            {applications.length}{" "}
            {t("dashboard.totalApplications").toLowerCase()}
            {pinnedCount > 0 &&
              ` • ${pinnedCount} ${t("common.pinned").toLowerCase()}`}
          </p>
        </div>
        <Link href="/applications/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t("nav.newApplication")}
          </Button>
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar />
        <div className="flex gap-2 flex-wrap">
          <StatusFilter />
          <FilterModal />
          <SortDropdown />
          <Button
            variant="outline"
            onClick={toggleViewMode}
            className="group gap-1.5"
            aria-label={
              viewMode === "list" ? t("common.kanbanView") : t("common.listView")
            }
          >
            {viewMode === "list" ? (
              <LayoutGrid className="h-4 w-4" />
            ) : (
              <List className="h-4 w-4" />
            )}
            <span className="max-w-0 opacity-0 overflow-hidden whitespace-nowrap transition-all duration-200 sm:group-hover:max-w-[160px] sm:group-hover:opacity-100 sm:group-hover:ml-2">
              {viewMode === "list"
                ? t("common.kanbanView")
                : t("common.listView")}
            </span>
          </Button>
        </div>
      </div>

      {/* Results */}
      {filteredApplications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FileX className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">{t("common.noResults")}</p>
        </div>
      ) : (
        <>
          {viewMode === "list" ? (
            <div className="grid gap-4">
              {filteredApplications.map((application) => (
                <ApplicationCard key={application.id} application={application} />
              ))}
            </div>
          ) : (
            <KanbanBoard applications={filteredApplications} />
          )}
        </>
      )}
    </div>
  );
}
