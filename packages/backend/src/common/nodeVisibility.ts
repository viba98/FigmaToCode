type VisibilityMixin = { visible: boolean };
const isVisible = (node: VisibilityMixin) => node.visible;
export const getVisibleNodes = (nodes: ReadonlyArray<SceneNode>): SceneNode[] => {
  console.log('nodes from getvisible nodes', nodes)
  const visibleNodes = nodes.filter(node => node.visible);
  console.log('Visible nodes:', visibleNodes);
  return visibleNodes;
};
