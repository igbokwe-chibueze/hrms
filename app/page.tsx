
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  UserPlus,
  Calendar,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  DollarSign,
  Briefcase,
  Award,
} from "lucide-react"

const quickStats = [
  {
    title: "Total Employees",
    value: "150",
    change: "+5%",
    icon: Users,
    color: "text-blue-600",
  },
  {
    title: "New Hires",
    value: "8",
    change: "This month",
    icon: UserPlus,
    color: "text-green-600",
  },
  {
    title: "Present Today",
    value: "142",
    change: "94.7%",
    icon: CheckCircle,
    color: "text-green-600",
  },
  {
    title: "Pending Leaves",
    value: "12",
    change: "Awaiting approval",
    icon: Calendar,
    color: "text-yellow-600",
  },
]

const recentActivities = [
  {
    id: 1,
    type: "hire",
    message: "John Doe joined as Senior Developer",
    time: "2 hours ago",
    icon: UserPlus,
  },
  {
    id: 2,
    type: "leave",
    message: "Jane Smith's leave request approved",
    time: "4 hours ago",
    icon: Calendar,
  },
  {
    id: 3,
    type: "performance",
    message: "Q1 performance reviews completed",
    time: "1 day ago",
    icon: Award,
  },
  {
    id: 4,
    type: "payroll",
    message: "January payroll processed successfully",
    time: "2 days ago",
    icon: DollarSign,
  },
]

const upcomingTasks = [
  {
    id: 1,
    task: "Complete Q1 performance reviews",
    dueDate: "Mar 31, 2024",
    priority: "High",
    progress: 75,
  },
  {
    id: 2,
    task: "Process February payroll",
    dueDate: "Feb 28, 2024",
    priority: "High",
    progress: 0,
  },
  {
    id: 3,
    task: "Update employee handbook",
    dueDate: "Apr 15, 2024",
    priority: "Medium",
    progress: 30,
  },
  {
    id: 4,
    task: "Conduct exit interviews",
    dueDate: "Mar 15, 2024",
    priority: "Low",
    progress: 50,
  },
]

export default function Dashboard() {
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "High":
        return <Badge variant="destructive">High</Badge>
      case "Medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
      case "Low":
        return <Badge variant="outline">Low</Badge>
      default:
        return <Badge variant="secondary">{priority}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here is what is happening in your organization.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Activities */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest updates and activities in your HR system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <activity.icon className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <UserPlus className="mr-2 h-4 w-4" />
              Add New Employee
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Approve Leave Requests
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <DollarSign className="mr-2 h-4 w-4" />
              Process Payroll
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <Briefcase className="mr-2 h-4 w-4" />
              Post New Job
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <Award className="mr-2 h-4 w-4" />
              Conduct Review
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
            <CardDescription>Tasks that need your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">{task.task}</h4>
                    {getPriorityBadge(task.priority)}
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Due: {task.dueDate}</span>
                    <span>{task.progress}% complete</span>
                  </div>
                  <Progress value={task.progress} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Department Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Department Overview</CardTitle>
            <CardDescription>Employee distribution by department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Engineering</span>
                </div>
                <span className="text-sm font-medium">45 employees</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Sales</span>
                </div>
                <span className="text-sm font-medium">32 employees</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">Marketing</span>
                </div>
                <span className="text-sm font-medium">28 employees</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm">HR</span>
                </div>
                <span className="text-sm font-medium">15 employees</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Finance</span>
                </div>
                <span className="text-sm font-medium">12 employees</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                  <span className="text-sm">Operations</span>
                </div>
                <span className="text-sm font-medium">18 employees</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts & Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            Alerts & Notifications
          </CardTitle>
          <CardDescription>Important items that require attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 border border-yellow-200 rounded-lg">
              <Clock className="h-4 w-4 text-yellow-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">12 leave requests pending approval</p>
                <p className="text-xs text-muted-foreground">Some requests are overdue for review</p>
              </div>
              <Button size="sm" variant="outline">
                Review
              </Button>
            </div>
            <div className="flex items-center space-x-3 p-3 border border-blue-200 rounded-lg">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">Q1 performance reviews due soon</p>
                <p className="text-xs text-muted-foreground">25% of reviews still need to be completed</p>
              </div>
              <Button size="sm" variant="outline">
                View
              </Button>
            </div>
            <div className="flex items-center space-x-3 p-3 border border-green-200 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">Payroll processed successfully</p>
                <p className="text-xs text-muted-foreground">January payroll completed for all employees</p>
              </div>
              <Button size="sm" variant="outline">
                Details
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
