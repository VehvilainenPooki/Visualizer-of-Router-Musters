# Create and Edit
## Create
You can enter the new illustration creation by clicking the `Create your own network visualization` on the home page or from the `create` button in navDrawer shown by clicking the project icon at top left corner.

### New illustration options
There are three starting points for your illustration:
- blank — Start from an empty canvas
- basic — A router connected to a desktop
- complex — A small network with multiple devices

## Edit
On the edit page there is the graph on the right, code editor on the left and metadata on the navigation bar.
### The Graph
This shows what the code on the left produces*. You can zoom and pan the view and drag the nodes around. You can click a node and it will select it. Clicking it again or clicking empty canvas deselects the node.

> *Selecting a node affects what the Code editor displays and so it doesn't always show all the code.

### Code Editor v. 1.0 (barely passable)
In the editor you can currently only edit the values of the data due to time constraints. There you can change field values. Node and Link id is the identity of the object, this is what is used in the Link target and source to define the nodes that the link connects. `Ctrl`+`click` on a Node id value selects that node.

**adding and removing objects:** There are plus and minus buttons around each node and link. Clicking the plus button adds a node/link under that object. Clicking the minus button alerts the user of what will be deleted and confiming it deletes the node and all links connected to it. If you want to skip the alert you can `Shift`+`click` to skip the alert.

**When a node is selected** the code editor shows only that node and all links connected to it. Plus buttons now create nodes and links that automatically are linked to the selected node. Selecting a node and then adding a node to it is definitely the easiest way to build linked nodes.

### NavBar
**Visibility:** The visibility toggle shows is your illustration public or private. Public illustrations are visible to everyone on the browse page. Clicking the deactice option changes the visibility to it.

**Title and Description:** In the middle of the navbar there is the title of you illustration. Clicking it allows you to edit the title and the description.

**The Save Indicator:** This icon shows the current save status and clicking it allows you to change the save destination. Currently there are two destinations:
- server, which saves it under your account
- local, which is not yet implemented but would allow you to save a file to your device and then load it later. This option would be available even without a user

Understanding the indicator colors:
- flashing red, no save location
- flashing orange, save failed
- blue, queueing a save
- green, successful save
- black with checkmark, save up to date