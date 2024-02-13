import {
  Banner,
  useApi,
  useTranslate,
  useSettings,
  reactExtension,
} from '@shopify/ui-extensions-react/checkout';

const checkoutBlock = reactExtension(
  'purchase.checkout.block.render',
  () => <Extension />,
);
export { checkoutBlock };

const deliveryAddress = reactExtension(
  'purchase.checkout.delivery-address.render-before', () => <Extension />,
)
export { deliveryAddress };

function Extension() {
  const translate = useTranslate();
  const { extension } = useApi();
    // Use the merchant-defined settings  from toml file to retrieve the extension's content
  // Use the merchant-defined settings to retrieve the extension's content
  const {title: merchantTitle, description, collapsible, status: merchantStatus} = useSettings();

  const status = merchantStatus ?? 'Custom Banner';
  const title = merchantTitle ?? 'Custom Banner';


  //Banner component doesn't take description as prop. https://shopify.dev/docs/api/checkout-ui-extensions/2024-01/components/feedback/banner
  //since we have description from useSettings hook we can use it as children of Banner component
  return (
    <Banner title={title} status={status} collapsible={collapsible}>
      {description}
    </Banner>
  );
}
