import { useEffect, useState } from 'react';
import { Order } from '@/types';
import { fetchOrdersByUser } from '@/lib/api';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';

interface OrdersListProps {
  userId: string;
}

export function OrdersList({ userId }: OrdersListProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchOrdersByUser(userId);
        setOrders(data);
      } catch (error) {
        // Handle error
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, [userId]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardHeader>
            <h3 className="font-semibold">Order #{order.id}</h3>
            <p className="text-sm text-muted-foreground">{new Date(order.date).toLocaleDateString()}</p>
          </CardHeader>
          <CardContent>
            {/* Display order items */}
          </CardContent>
          <CardFooter>
            <Button variant="outline">View Details</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
