export function log(message: string) {
  alert(message);
}

export function getMediaPath(filename: string): null | string {
  var root = app.project.rootItem;
  if (root == null) {
    alert("Could not retrieve rootItem.");
    return null;
  }

  var item = getItemByName(filename, root);
  if (item == null) {
    alert("Could not find file");
    return null;
  }
  return item.getMediaPath();
}

export function addCaptions(filename: string) {
  var root = app.project.rootItem;
  if (root == null) {
    alert("Could not retrieve rootItem.");
    return;
  }

  var item = getItemByName(filename, root);
  if (item == null) {
    alert("Could not find file");
    return;
  }

  // refreshing the media path
  if (item.canChangeMediaPath()) {
    item.changeMediaPath(item.getMediaPath(), 1);
  }

  var activeSequence = app.project.activeSequence;
  if (activeSequence === null) {
    alert("No active sequence.");
    return;
  }

  var result = activeSequence.createCaptionTrack(item, 0, Sequence.CAPTION_FORMAT_SUBTITLE);
  if (result) {
    alert("success");
  } else {
    alert("could not create captions");
  }
}

export function getItemByName(name: string, root: ProjectItem): ProjectItem | null {
  if (root.type != ProjectItemType.ROOT) {
    if (root.name == name) {
      return root;
    }
    return null;
  }

  for (var i = 0; i < root.children.numItems; i++) {
    var result = getItemByName(name, root.children[i]);
    if (result != null) {
      return result;
    }
  }

  return null;
}
