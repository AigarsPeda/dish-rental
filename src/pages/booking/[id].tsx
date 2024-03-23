import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { type DateValueType } from "react-tailwindcss-datepicker";
import { z } from "zod";
import PageHead from "~/components/PageHead/PageHead";
import { OrderSchema, type OrderType } from "~/types/order.schema";

export type FormStateType = {
  selectedCategories: string[];
  availableDates: DateValueType;
};

const UrlSchema = z.array(OrderSchema);

const Home: NextPage = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderType[]>([]);

  useEffect(() => {
    if (!router.query.orders || typeof router.query.orders !== "string") {
      console.error("No orders in query");
      return;
    }

    const validOrders = UrlSchema.parse(JSON.parse(router.query.orders));
    setOrders(validOrders);
  }, [router.query.orders]);

  return (
    <>
      <PageHead
        title="Trauku noma"
        descriptionShort="Nomā vai iznomā traukus"
        descriptionLong="Nomā vai iznomā traukus"
      />
      <main className="min-h-screen bg-gray-100 bg-gradient-to-b">
        <h1 className="mt-8 text-center text-3xl font-bold">
          Trauku noma {router.query.id}
        </h1>
        <code>{JSON.stringify(orders)}</code>
      </main>
    </>
  );
};

export default Home;
