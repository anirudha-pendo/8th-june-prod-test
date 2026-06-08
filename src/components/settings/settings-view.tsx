"use client";

import {
  Building03Icon,
  SaveIcon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { AppIcon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useSettings, useUpdateSettings } from "@/hooks/use-settings";
import type { SettingsResponse } from "@/lib/types";

export function SettingsView() {
  const settings = useSettings();

  if (settings.isPending) {
    return (
      <div className="w-full max-w-3xl">
        <Skeleton className="h-[26rem] rounded-lg" />
      </div>
    );
  }

  if (settings.isError) {
    return (
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Settings unavailable</CardTitle>
          <CardDescription>{settings.error.message}</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => settings.refetch()}>Retry</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-3xl">
      <div className="mb-6 flex flex-col gap-1">
        <div className="font-editorial text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground">
          Preferences
        </div>
        <h1 className="text-2xl font-medium tracking-tight">Settings</h1>
        <p className="max-w-xl text-sm text-muted-foreground">
          Manage your account and workspace.
        </p>
      </div>
      <Tabs defaultValue="profile" className="w-full">
        <TabsList variant="line">
          <TabsTrigger value="profile">
            <AppIcon icon={UserIcon} data-icon="inline-start" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="organization">
            <AppIcon icon={Building03Icon} data-icon="inline-start" />
            Organization
          </TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="pt-4">
          <ProfileSettingsForm settings={settings.data} />
        </TabsContent>
        <TabsContent value="organization" className="pt-4">
          <OrganizationSettingsForm settings={settings.data} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ProfileSettingsForm({ settings }: { settings: SettingsResponse }) {
  const updateSettings = useUpdateSettings();

  async function handleProfileSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const name = String(formData.get("name") ?? "");
    const image = String(formData.get("image") ?? "");

    await updateSettings.mutateAsync({ name, image });

    if (typeof window !== "undefined" && window.pendo) {
      const fieldsUpdated: string[] = [];
      if (name !== settings.user.name) fieldsUpdated.push("name");
      if (image !== (settings.user.image ?? "")) fieldsUpdated.push("image");
      pendo.track("profile_updated", {
        fields_updated: fieldsUpdated.join(","),
        has_avatar: image.length > 0,
      });
    }
    toast.success("Profile updated");
  }

  return (
    <Card className="shadow-[0_24px_80px_-72px_rgba(15,23,42,0.75)]">
      <form onSubmit={handleProfileSubmit}>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update how your account appears.</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="profile-name">Name</FieldLabel>
              <Input
                id="profile-name"
                name="name"
                defaultValue={settings.user.name}
                minLength={2}
                maxLength={80}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="profile-image">Avatar URL</FieldLabel>
              <Input
                id="profile-image"
                name="image"
                type="url"
                defaultValue={settings.user.image ?? ""}
              />
              <FieldDescription>Optional image URL.</FieldDescription>
            </Field>
            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input value={settings.user.email} disabled />
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={updateSettings.isPending}>
            {updateSettings.isPending ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <AppIcon icon={SaveIcon} data-icon="inline-start" />
            )}
            Save profile
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

function OrganizationSettingsForm({ settings }: { settings: SettingsResponse }) {
  const updateSettings = useUpdateSettings();

  async function handleOrganizationSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const organizationName = String(formData.get("organizationName") ?? "");

    await updateSettings.mutateAsync({ organizationName });

    if (typeof window !== "undefined" && window.pendo) {
      pendo.track("organization_updated", {
        organization_name_length: organizationName.length,
      });
    }
    toast.success("Organization updated");
  }

  return (
    <Card className="shadow-[0_24px_80px_-72px_rgba(15,23,42,0.75)]">
      <form onSubmit={handleOrganizationSubmit}>
        <CardHeader>
          <CardTitle>Organization</CardTitle>
          <CardDescription>Rename the workspace for this account.</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="organization-name">Name</FieldLabel>
              <Input
                id="organization-name"
                name="organizationName"
                defaultValue={String(settings.organization.name)}
                minLength={2}
                maxLength={80}
              />
            </Field>
            <Field>
              <FieldLabel>Slug</FieldLabel>
              <Input value={String(settings.organization.slug)} disabled />
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={updateSettings.isPending}>
            {updateSettings.isPending ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <AppIcon icon={SaveIcon} data-icon="inline-start" />
            )}
            Save organization
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
