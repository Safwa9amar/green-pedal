import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddBike } from "@/components/forms/AddBike";
import { getBikesData } from "@/lib/services/bikes";
import { getAllStations } from "../stations/actions";
import BikesTable from "./BikesTable";

export default async function BikesPage() {
  const bikes = await getBikesData(); // ✅ Safe on server
  const stations = await getAllStations();

  return (
    <>
      <PageHeader title="Bikes">
        <AddBike stations={stations} />
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>Bike Fleet</CardTitle>
        </CardHeader>
        <CardContent>
          <BikesTable bikes={bikes} stations={stations} />
        </CardContent>
      </Card>
    </>
  );
}
