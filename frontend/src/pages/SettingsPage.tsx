import { DashboardLayout } from "../components/dashboard/index";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Bell, Clock, Link2, Save } from "lucide-react";

export default function Settings() {
  return (
    <DashboardLayout>
      <div className="max-w-2xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your account and preferences
          </p>
        </div>

        {/* Profile Section */}
        <div className="rounded-2xl border border-border bg-card p-6 card-shadow">
          <div className="flex items-center gap-3 border-b  border-border pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
              <User className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Profile</h2>
              <p className="text-xs text-muted-foreground">Your personal information</p>
            </div>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs font-medium">Name</Label>
              <Input 
                id="name" 
                defaultValue="John Doe" 
                className="rounded-xl border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-medium">Email</Label>
              <Input 
                id="email" 
                defaultValue="john@example.com" 
                className="rounded-xl border-border"
              />
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="rounded-2xl border border-border bg-card p-6 card-shadow">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
              <Bell className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Notifications</h2>
              <p className="text-xs text-muted-foreground">Manage your alert preferences</p>
            </div>
          </div>
          <div className="mt-5 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Email Notifications</Label>
                <p className="text-xs text-muted-foreground">
                  Receive alerts for new signals
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Daily Briefing</Label>
                <p className="text-xs text-muted-foreground">
                  Get daily market summary at 9 AM
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Signal Alerts</Label>
                <p className="text-xs text-muted-foreground">
                  Push notifications for high-confidence signals
                </p>
              </div>
              <Switch />
            </div>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="rounded-2xl border border-border bg-card p-6 card-shadow">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
              <Clock className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Preferences</h2>
              <p className="text-xs text-muted-foreground">Customize your experience</p>
            </div>
          </div>
          <div className="mt-5 space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium">Default Timeframe</Label>
              <Select defaultValue="1d">
                <SelectTrigger className="w-48 rounded-xl border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15m">15 Minutes</SelectItem>
                  <SelectItem value="1h">1 Hour</SelectItem>
                  <SelectItem value="4h">4 Hours</SelectItem>
                  <SelectItem value="1d">1 Day</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium">Risk Tolerance</Label>
              <Select defaultValue="moderate">
                <SelectTrigger className="w-48 rounded-xl border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conservative">Conservative</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="aggressive">Aggressive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* API Section */}
        <div className="rounded-2xl border border-border bg-card p-6 card-shadow">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
              <Link2 className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Integrations</h2>
              <p className="text-xs text-muted-foreground">Connect your trading account</p>
            </div>
          </div>
          <div className="mt-5 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="broker" className="text-xs font-medium">Broker API Key</Label>
              <Input
                id="broker"
                type="password"
                placeholder="Enter your broker API key"
                className="rounded-xl border-border"
              />
            </div>
            <Button className="rounded-xl bg-accent text-accent-foreground hover:bg-accent/90">
              Connect Broker
            </Button>
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end pb-6">
          <Button className="rounded-xl bg-foreground text-background hover:bg-foreground/90">
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
