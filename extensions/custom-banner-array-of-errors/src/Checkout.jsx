import {
  reactExtension,
  Banner,
  List,
  ListItem,
} from "@shopify/ui-extensions-react/checkout";



const arrayOfErrors = reactExtension("purchase.checkout.delivery-address.render-before", () => (
  <Extension />
));
export { arrayOfErrors };

// const deliveryAddress = reactExtension("purchase.checkout.delivery-address.render-before", () => (
//   <Extension />
// ));
// export { deliveryAddress };

function Extension() {

  return  (
    <Banner status="critical" title="You have some errors">
      <List>
        <ListItem>100% organic cotton</ListItem>
        <ListItem>Made in Canada</ListItem>
        <ListItem>Machine washable</ListItem>
      </List>
    </Banner>
  )
}
