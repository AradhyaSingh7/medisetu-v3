import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { auditLogs } from "@/data/mockData";
import { FileText, Clock, User } from "lucide-react";

export const AuditLogs = () => {
  const formatTimestamp = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getActionBadge = (action: string) => {
    if (action.includes("Updated")) {
      return <Badge className="bg-primary text-primary-foreground">Update</Badge>;
    }
    if (action.includes("Request")) {
      return <Badge className="bg-warning text-warning-foreground">Request</Badge>;
    }
    if (action.includes("Matched")) {
      return <Badge className="bg-success text-success-foreground">Match</Badge>;
    }
    if (action.includes("Dispatched")) {
      return <Badge className="bg-accent text-accent-foreground">Dispatch</Badge>;
    }
    return <Badge>Info</Badge>;
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="container mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Audit Logs</h1>
              <p className="text-lg text-muted-foreground">
                Complete activity trail for compliance and monitoring
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card className="p-6 bg-gradient-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Logs</p>
                <p className="text-3xl font-bold text-foreground">{auditLogs.length}</p>
              </div>
              <FileText className="h-10 w-10 text-primary" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Today's Activity</p>
                <p className="text-3xl font-bold text-accent">
                  {auditLogs.filter(log => {
                    const logDate = new Date(log.timestamp);
                    const today = new Date();
                    return logDate.toDateString() === today.toDateString();
                  }).length}
                </p>
              </div>
              <Clock className="h-10 w-10 text-accent" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Active Users</p>
                <p className="text-3xl font-bold text-success">
                  {new Set(auditLogs.map(log => log.userId)).size}
                </p>
              </div>
              <User className="h-10 w-10 text-success" />
            </div>
          </Card>
        </div>

        {/* Logs Table */}
        <Card className="p-6 shadow-card">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Activity Log</h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Log ID</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs.length > 0 ? (
                  auditLogs.map((log) => (
                    <TableRow key={log.id} className="hover:bg-muted/50">
                      <TableCell className="font-mono text-sm">{log.id}</TableCell>
                      <TableCell className="font-semibold">{log.action}</TableCell>
                      <TableCell>{getActionBadge(log.action)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{log.userId}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{formatTimestamp(log.timestamp)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-md">
                        {log.details}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <p className="text-muted-foreground">No audit logs available</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> All system activities are automatically logged for security, compliance, and audit purposes. 
              Logs are retained for regulatory compliance and can be exported upon request.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
