import { Settings as SettingsIcon, Shield, Bell, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-2 flex items-center gap-3">
          <SettingsIcon className="w-10 h-10 text-primary" />
          Settings
        </h1>
        <p className="text-muted-foreground text-lg">
          Manage your account preferences and application configurations.
        </p>
      </div>

      <div className="grid gap-6 max-w-4xl">
        <Card className="border-muted">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Shield size={20} />
              </div>
              <div>
                <CardTitle>Account Security</CardTitle>
                <CardDescription>Update your password and security settings.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl border bg-muted/30">
              <div>
                <p className="font-bold">Password</p>
                <p className="text-sm text-muted-foreground">Change your current password</p>
              </div>
              <Button variant="outline">Update</Button>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl border bg-muted/30">
              <div>
                <p className="font-bold">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
              </div>
              <Button variant="outline">Enable</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-muted opacity-50 grayscale cursor-not-allowed">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Bell size={20} />
              </div>
              <div>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Choose what you want to be notified about.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm italic">Notification settings coming soon in the next update.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
