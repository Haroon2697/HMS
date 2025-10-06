import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export async function RecentPatients() {
  const supabase = await createClient()

  const { data: patients } = await supabase
    .from("patients")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Patients</CardTitle>
      </CardHeader>
      <CardContent>
        {patients && patients.length > 0 ? (
          <div className="space-y-4">
            {patients.map((patient) => (
              <div key={patient.id} className="flex items-center gap-4">
                <Avatar>
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                    {patient.full_name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{patient.full_name}</p>
                  <p className="text-xs text-muted-foreground">{patient.patient_id}</p>
                </div>
                <Badge variant="outline">{patient.gender}</Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No patients yet</p>
        )}
      </CardContent>
    </Card>
  )
}
