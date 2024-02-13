import { useEffect, useState } from "react";
import {
  Button,
  reactExtension,
  useApi,
} from "@shopify/ui-extensions-react/customer-account";

export default reactExtension(
  "customer-account.order.action.menu-item.render",
  ( ) => <MenuActionExtension />
);

function MenuActionExtension( ) {
  const {orderId} = useApi()
  const [showAction, setShowAction] = useState(false)

  useEffect(() => {
    const orderQuery = {
      query: `query {
        order(id: "${orderId}") {
          fulfillments(first: 10) {
            nodes {
              latestShipmentStatus
            }
          }
        }
      }`
    };

    fetch("shopify://customer-account/api/latest/graphql.json",
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderQuery),
        }).then((response) => response.json())
        .then(({data}) => {
          setShowAction(data.order.fulfillments.nodes.length !== 0)
        }).catch(console.error);
  }, [orderId]);

  if (!showAction) return null;

  return (
    <Button>Report a problem</Button>
  );
}
