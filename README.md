## Contacts List

_Link_
http://sea-turtle-app-iudlb.ondigitalocean.app

_Goal_
The goal was to create a web application that users can log into, either being with google or an email and password, and be able to access a personal list of contacts. These contacts can be modified, added, or removed.

_Challenges Faced_

- Implementing OAuth (Google and Local)
- Deploying to a server (Digital Ocean)
- Implementing Multiple Pages (Login, Register, Contacts)

_Authentication Strategy_
I decided to choose Google+ w/ passport.js as my authentication strategy mostly because it is the strategy that I use to login the most in my day to day life.

_CSS Framework_
I used water.css mostly because I liked the dark and minimalist look compared to the other recommended style sheets.

- I did not make any modifications to the water.css
- Anything within my css (main.css) is likely related to font sizes, alignment, and sizing of elements

_Express Middleware Packages_

- passport.js was used in order to implement OAuth
- express-session was used in order to keep track of the user's session
- bcrypt was used in order to hash the user's password
- express-flash was used in order to display flash messages to the user
- method-override was used in order to allow for the use of PUT and DELETE requests

## Technical Achievements

- **Tech Achievement 1**: I implemented OAuth authentication via passport.js and Google+. This was very difficult to implement, but I was able to get it working with the help of the passport.js documentation and a few tutorials.
- **Tech Achievement 2**: I hosted my website on Digital Ocean instead of Glitch. This mean that my site was faster and more reliable, but it was also more expensive and required more work to set up. Additionally my site was always running, as opposed to Glitch which shuts down after a period of inactivity.
- **Tech Achievement 3**: I got 100% on all four lighthouse tests.
  ![Alt text](image.png)

### Design/Evaluation Achievements

- **Design Achievement 1**: I followed the following tips from the W3C Web Accessibility Initiative
- Provide Informative, Unique Page Titles: I made sure that each page had a unique title that was descriptive of the page's content. For example, the login page's title is "Login - Contacts List".
- Ensure that form elements include clearly associated labels: I made sure that each form element had a label that was clearly associated with it.
- Provide clear and consistent navigation options: I made sure that the navigation bar at was consistent across all pages, and removed buttons that were no longer accessible
- Use headings and spacing to group related content: I made sure that each page had headings that were descriptive of the content below it, and that the content was grouped together in a logical way. For example, the forms group the different inputs together in what I believe to be a logical way.
- Help users avoid and correct mistakes: Provided examples for form inputs.
- Provide sufficient contrast between foreground and background: I made sure that the contrast between the foreground and background was sufficient.
- Ensure that interactive elements are easy to identify: I made sure that interactive elements were easy to identify by making them stand out from the rest of the page.
- Ensure that all interactive elements are keyboard accessible: I made sure that all interactive elements were keyboard accessible by using the tab key to navigate through the page.
