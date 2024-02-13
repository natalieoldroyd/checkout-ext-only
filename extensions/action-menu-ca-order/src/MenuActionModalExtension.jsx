import {
  Button,
  CustomerAccountAction,
  reactExtension,
  useApi,
  Select,
  Form,
} from "@shopify/ui-extensions-react/customer-account";
import { useState } from "react";

export default reactExtension("customer-account.order.action.render", () => (
  <MenuActionModalExtension />
));
//takes arg of extension target with callback returning the component to be rendered at the target's location

const dtcOptions = [
  { value: "1", label: "Package item is damaged" },
  { value: "2", label: "Missing items" },
  { value: "3", label: "Wrong item was sent" },
  { value: "4", label: "Item arrived too late" },
  { value: "5", label: "Never received item" },
];

const b2bOptions = dtcOptions.concat([
  { value: "6", label: "Package sent to the wrong company location" },
]);

function MenuActionModalExtension() {
  const { close, authenticatedAccount } = useApi();
  //close is required https://shopify.dev/docs/api/customer-account-ui-extensions/unstable/targets/order-action-menu/customer-account-order-action-render#orderapi
  //authenticatedAccount is required to check if the customer is a B2B customer. Comes off the Standared API https://shopify.dev/docs/api/customer-account-ui-extensions/unstable/targets/order-action-menu/customer-account-order-action-render#standardapi-propertydetail-authenticatedaccount
  const [currentProblem, setCurrentProblem] = useState("1");
  const [isLoading, setIsLoading] = useState(false);

  const isB2BCustomer = authenticatedAccount.purchasingCompany.current != null;

  function onSubmit() {
    // Simulating a request to your server to store the reported problem
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      close();
    }, 750);
  }

  return (
    <CustomerAccountAction
      title="Report a problem"
      primaryAction={
        <Button loading={isLoading} onPress={() => onSubmit()}>
          Report
        </Button>
      }
      secondaryAction={
        <Button
          onPress={() => {
            close();
          }}
        >
          Cancel
        </Button>
      }
    >
      <Form onSubmit={() => onSubmit()}>
        <Select
          label="Select a problem"
          options={isB2BCustomer ? b2bOptions : dtcOptions}
          value={currentProblem}
          onChange={(value) => setCurrentProblem(value)}
        />
      </Form>
    </CustomerAccountAction>
  );
}

