Embed checkout (Public Beta)
Learn how to embed Whop’s checkout flow on your website

Embedded checkout allows you to embed Whop’s checkout flow on your own website in two easy steps. This allows you to offer your users a seamless checkout experience without leaving your website.

​
React
​
Step 1: Install the package

Copy
npm install @whop/react
​
Step 2: Add the checkout element

Copy
import { WhopCheckoutEmbed } from "@whop/react/checkout";

export default function Home() {
  return <WhopCheckoutEmbed planId="plan_Rzez3JT4Fkkl6" />;
}
This component will now mount an iframe with the Whop checkout embed. Once the checkout is complete, the user will be redirected to the redirect url you specified in the settings on Whop.

You can configure the redirect url in your whop’s settings or in your company’s settings on the dashboard. If both are specified, the redirect url specified in the whop’s settings will take precedence.

​
Available properties
​
planId
Required - The plan id you want to checkout.

​
theme
Optional - The theme you want to use for the checkout.

Possible values are light, dark or system.

​
sessionId
Optional - The session id to use for the checkout.

This can be used to attach metadata to a checkout by first creating a session through the API and then passing the session id to the checkout element.

​
fallback
Optional - The fallback content to show while the checkout is loading.


Copy
<WhopCheckoutEmbed fallback={<>loading...</>} planId="plan_XXXXXXXXX" />
​
Full example

Copy
import { WhopCheckoutEmbed } from "@whop/react/checkout";

export default function Home() {
  return (
    <WhopCheckoutEmbed
      fallback={<>loading...</>}
      planId="plan_XXXXXXXXX"
      theme="light"
      sessionId="ch_XXXXXXXXX"
    />
  );
}
​
Other websites
​
Step 1: Add the script tag
To embed checkout, you need to add the following script tag into the <head> of your page:


Copy
<script
  async
  defer
  src="https://js.whop.com/static/checkout/loader.js"
></script>
​
Step 2: Add the checkout element
To create a checkout element, you need to include the following attribute on an element in your page:


Copy
<div data-whop-checkout-plan-id="plan_XXXXXXXXX"></div>
This will now mount an iframe inside of the element with the plan id you provided. Once the checkout is complete, the user will be redirected to the redirect url you specified in the settings on Whop.

You can configure the redirect url in your whop’s settings or in your company’s settings on the dashboard. If both are specified, the redirect url specified in the whop’s settings will take precedence.

​
Available attributes
​
data-whop-checkout-plan-id
Required - The plan id you want to checkout.

To get your plan id, you need to first create a plan in the Manage Pricing section on your whop page.

​
data-whop-checkout-theme
Optional - The theme you want to use for the checkout.

Possible values are light, dark or system.


Copy
<div data-whop-checkout-theme="light" data-whop-checkout-plan-id="plan_XXXXXXXXX"></div>
​
data-whop-checkout-session-id
Optional - The session id to use for the checkout.

This can be used to attach metadata to a checkout by first creating a session through the API and then passing the session id to the checkout element.


Copy
<div data-whop-checkout-session-id="ch_XXXXXXXXX" data-whop-checkout-plan-id="plan_XXXXXXXXX"></div>
​
Full example

Copy
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width">
		<script
			async
			defer
  			src="https://js.whop.com/static/checkout/loader.js"
		></script>
		<title>Whop embedded checkout example</title>
		<style>
			div {
				box-sizing: border-box;
			}
			body {
				margin: 0
			}
		</style>
	</head>
	<body>
		<div
			data-whop-checkout-plan-id="plan_XXXXXXXXX"
			data-whop-checkout-session-id="ch_XXXXXXXXX"
			data-whop-checkout-theme="light"
			style="height: fit-content; overflow: hidden; max-width: 50%;"
		></div>
	</body>
</html>