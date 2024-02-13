import React, { useState } from "react";
import {
  reactExtension,
  TextField,
  BlockStack,
  useApplyMetafieldsChange,
  useMetafield,
  Checkbox,
} from "@shopify/ui-extensions-react/checkout";

const shippingOptionListAfter = reactExtension(
  "purchase.checkout.shipping-option-list.render-after",
  () => <Extension />
);
export { shippingOptionListAfter};

const shippingOptionListBefore = reactExtension("purchase.checkout.shipping-option-list.render-before", () => <Extension />);
export { shippingOptionListBefore};

function Extension() {
  const [checked, setChecked] = useState(false);

  const metafieldNameSpace = "shipping_option_list";
  const metafieldKey = "delivery_instructions";

  const deliveryInstructions = useMetafield({
    namespace:  metafieldNameSpace,
    key: metafieldKey,
  });

 // Set a function to handle updating a metafield
  const applyMetafieldsChange = useApplyMetafieldsChange();

  //handles onChange event for checkbox
const handleChange = () => {
  setChecked(!checked);
}

  return (
    <BlockStack title="custom-field-shipping-option-list">
      <Checkbox checked={checked} onChange={handleChange} >
        Provide Delivery Instructions
        </Checkbox>
        {checked && (
          <TextField
            label="Delivery Instructions"
            onChange={(value) => {
              applyMetafieldsChange({
                type: "updateMetafield",
                namespace: metafieldNameSpace,
                key: metafieldKey,
                valueType: "string",
                value,
              });
            }}
            value={deliveryInstructions?.value || ""}
          />
        )}
    </BlockStack>
  );
}
