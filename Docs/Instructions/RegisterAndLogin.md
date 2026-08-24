# Authentication
The project has a single authetication modal (authModal) that is found in the navDrawer opened by clicking the project logo at the top left corner. In there you'll see a login button if you aren't logged in. Otherwise it will be a Profile button which open a modal with the option to logout.

## Register
In the authModal there is a text `No account? Create one`. Clicking the link changes the view to registration. Here you can fill in your information and on submit it will prompt you to click to send a verification email to you. That email contains a verification url that marks your account as verified when opened.
 >Same email address can't be set for multiple users so be careful when creating your account. There also isn't currently a way to reset one's password so really be careful.

After you have verified your account you can go back to the window that has the send verification email and click the button `I've verified — continue`.

## Login
In the authModal `login` enter your username and password.

There are three test users on the demo website if you prefer not to insert your email address: pooki, potsu, qwerty. Each has the same username and password.


## Profile
In the authModal `profile` there is currently very little info. It just announces what user is logged in and has the option for logout.