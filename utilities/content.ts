export const getDialogContent = (activeDialog: string) => {
  const content = {
    heading: "Confirmation",
    content: "Are you sure?",
    action: "Yes",
  };
  switch (activeDialog) {
    case "mark-lost":
      content.heading = "Are you lost?";
      content.content = "Mark yourself lost. Your Companions will find you.";
      content.action = "Confirm";
      break;
    case "mark-found":
      content.heading = "Mark found";
      content.content =
        "Mark yourself found. Your Companions will be notified.";
      content.action = "Confirm";
      break;
    default:
      content.heading = "Confirmation";
      content.content = "Are you sure?";
      content.action = "Yes";
  }
  return content;
};
