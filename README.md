How to update customer site:
First clone this repository to the local

Checkout from main branch to another branch, follow the convention: feature/TICKET-NUMBER

When done with the changes, create a Pull requests to merge the changes to the main branch. Add the dev team members as reviewer to review it before merge

Then merge to the main branch if the PR look good

Finally after the merge successful, it will automatically trigger the Netlify webhook to publish the latest version from Main branch

If the changes broke the customer website, revert the Pull request then it will rollback the old verion.
