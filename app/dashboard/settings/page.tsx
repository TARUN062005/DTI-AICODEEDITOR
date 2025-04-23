"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"

export default function SettingsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSaveSettings = async () => {
    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Success",
        description: "Settings saved successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black overflow-auto p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="h-10 w-10 p-0 rounded-full border border-gray-700 bg-gray-800/50 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
          >
            <Icons.chevronLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
        </div>

        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-black border border-gray-800">
            <TabsTrigger 
              value="account" 
              className="data-[state=active]:bg-gray-900 data-[state=active]:text-white transition-all duration-300"
            >
              Account
            </TabsTrigger>
            <TabsTrigger 
              value="editor" 
              className="data-[state=active]:bg-gray-900 data-[state=active]:text-white transition-all duration-300"
            >
              Editor
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="data-[state=active]:bg-gray-900 data-[state=active]:text-white transition-all duration-300"
            >
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <Card className="border-gray-800 bg-gray-900">
                <CardHeader>
                  <CardTitle className="text-white">Account Settings</CardTitle>
                  <CardDescription className="text-gray-400">
                    Manage your account information and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">
                      Name
                    </Label>
                    <Input 
                      id="name" 
                      defaultValue="John Doe" 
                      className="bg-gray-800 text-white border-gray-700 focus:border-gray-600 transition-colors" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">
                      Email
                    </Label>
                    <Input 
                      id="email" 
                      defaultValue="john.doe@example.com" 
                      className="bg-gray-800 text-white border-gray-700 focus:border-gray-600 transition-colors" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">
                      Password
                    </Label>
                    <Input 
                      id="password" 
                      type="password" 
                      defaultValue="********" 
                      className="bg-gray-800 text-white border-gray-700 focus:border-gray-600 transition-colors" 
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button
                    onClick={handleSaveSettings}
                    disabled={isLoading}
                    className="bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    {isLoading ? (
                      <>
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="editor">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <Card className="border-gray-800 bg-gray-900">
                <CardHeader>
                  <CardTitle className="text-white">Editor Settings</CardTitle>
                  <CardDescription className="text-gray-400">Customize your coding environment</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="theme" className="text-white">
                      Theme
                    </Label>
                    <Select value={theme} onValueChange={setTheme}>
                      <SelectTrigger className="bg-gray-800 text-white border-gray-700">
                        <SelectValue placeholder="Select a theme" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 text-white border-gray-700">
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="font-size" className="text-white">
                      Font Size
                    </Label>
                    <Select defaultValue="14">
                      <SelectTrigger className="bg-gray-800 text-white border-gray-700">
                        <SelectValue placeholder="Select font size" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 text-white border-gray-700">
                        <SelectItem value="12">12px</SelectItem>
                        <SelectItem value="14">14px</SelectItem>
                        <SelectItem value="16">16px</SelectItem>
                        <SelectItem value="18">18px</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="line-numbers" className="text-white">
                      Show Line Numbers
                    </Label>
                    <Switch 
                      id="line-numbers" 
                      defaultChecked 
                      className="data-[state=checked]:bg-blue-600"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="word-wrap" className="text-white">
                      Word Wrap
                    </Label>
                    <Switch 
                      id="word-wrap" 
                      defaultChecked 
                      className="data-[state=checked]:bg-blue-600"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-save" className="text-white">
                      Auto Save
                    </Label>
                    <Switch 
                      id="auto-save" 
                      defaultChecked 
                      className="data-[state=checked]:bg-blue-600"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button
                    onClick={handleSaveSettings}
                    disabled={isLoading}
                    className="bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    {isLoading ? (
                      <>
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="notifications">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <Card className="border-gray-800 bg-gray-900">
                <CardHeader>
                  <CardTitle className="text-white">Notification Settings</CardTitle>
                  <CardDescription className="text-gray-400">
                    Configure how and when you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-notifications" className="text-white">
                      Email Notifications
                    </Label>
                    <Switch 
                      id="email-notifications" 
                      defaultChecked 
                      className="data-[state=checked]:bg-blue-600"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-notifications" className="text-white">
                      Push Notifications
                    </Label>
                    <Switch 
                      id="push-notifications" 
                      defaultChecked 
                      className="data-[state=checked]:bg-blue-600"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="collaboration-invites" className="text-white">
                      Collaboration Invites
                    </Label>
                    <Switch 
                      id="collaboration-invites" 
                      defaultChecked 
                      className="data-[state=checked]:bg-blue-600"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="project-updates" className="text-white">
                      Project Updates
                    </Label>
                    <Switch 
                      id="project-updates" 
                      defaultChecked 
                      className="data-[state=checked]:bg-blue-600"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="security-alerts" className="text-white">
                      Security Alerts
                    </Label>
                    <Switch 
                      id="security-alerts" 
                      defaultChecked 
                      className="data-[state=checked]:bg-blue-600"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button
                    onClick={handleSaveSettings}
                    disabled={isLoading}
                    className="bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    {isLoading ? (
                      <>
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}