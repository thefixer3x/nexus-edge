import { useEffect, useState } from 'react';
import { Order } from '@/types';
import { fetchOrdersByUser } from '@/lib/api';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
        console.error('Error loading orders:', error);
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
            <p className="text-lg font-medium">${order.total.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground capitalize">{order.status}</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline">View Details</Button>
          </CardFooter>
        </Card>
      ))}
      {orders.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No orders found
        </div>
      )}
    </div>
  );
}
