# Project timelogs
This is for [fullstack project](https://github.com/fullstack-hy2020/misc/blob/master/project.md).

| date | time spent | what was done |
| -------- | -------- | -------- |
| 080226 | 3h | setting up the project and thinking about architecture |
| 090226 | 4h | Choosing graphing tool and learning D3-force |
| 110126 | 7h | Learning D3-force finally getting it and actually making progress I should have committed to git see the changes but oh well |
| 120226 | 4.5h | Learning more about d3-force added ability to create nodes and texts/labels during simulation. Should be easy to add same for links |
| 130226 | 6.5h | Added ability to add links and started a refactoring so that the graph has easily modifyable parts. It is so demanding to refactor. Started learning svg. drew little diagram to understand better how user iteracts with the tool. |
| 170226 | 4h | Moving d3 into its own module and refactoring it even more to get it more easily interactable. |
| 200226 | 2h | cleaning up the code and looking at creating better custom types |
| 230226 | 5h | Understanding large project structure and preparing project for backend and containerization. Added logo for project |
| 240226 | 4h | Adding timelogs to repo, adding temporary component to test client server connectivity and containerizing the project dev environment |
| 250226 | 8h | Starting backend development and containerizing project. Most of the commits haven't been pushed yet, cos node with ts has given me a lot of issues |
| 090326 | 3h | Getting to know hosting platforms and looking into the node ts problems |
| 100326 | 2h | Finally figuring out the node ts situation (lies) |
| 150326 | 1h | Looking for hosting options and setting up hosting on hetzner |
| 160326 | 2h | Continuing hetzner setup with ssh, docker and looking through old ci and what to use for deployment |
| 170326 |2h | fighting with node ts, starting to build the prod docker compose and learning traefik |
| 290326 | 4h | Fighting with node and ts and finally finding a totally working configuration for dev, build and docker |
| 300326 | 4h | prod docker and putting the app into hetzner |
| 020426 | 4h | Domain setup and ssl sertificate, Optimized dockerfile, start of ci |
| 210526 | 3h | Choosing CI pipeline -> GH actions and DokPloy - and working on the configuration |
| 230526 | 3h | Continuing DokPloy config and CI work and after success protecting it against attackers |
| 280526 | 3h | Sorting out the branches, adding protections against supply chain attacks, using Claude to do REST backend basics |
| 080626 | 5h | Thinking and planning... Backend must explode and be reconstructed :) |
| 090626 | 2h | Learning about tanstack and choosing between react router and tanstack router |
| 220626 | 8h | DokPloy troubleshooting and thinking about project rework |
| 230626 | 8h | Set up Dokploy database and link it to project, think about the project, start frontend explorations. Database must be redone for nice graph code saving and loading |
| 250626 | 6h | Add tsconfig to client again, make docker-compose.prod be used for build testing and fix build, ui exploration, some thinking about the project |
| 290626 | 6h | All the pondering of implementations, looking into security steps like cors, helmet, account email verification, captcha. implemented cors and helmet, looked into data management to keep server storage limit low -> remove accounts and illustrations after x days of inactivity as this is just in development |
| 300626 | 4h | Understanding tagged unions and making services use them. Making normal users have 5 illustration limit. |
| 010626 | 8h | Finish tagged union migration, finally actually choose ui, fix tsconfigging once again, start doing final UI implementation |