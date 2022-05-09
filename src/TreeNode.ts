export type LeafType = string | number | undefined;

export default class TreeNode {
    feature: string = '';
    treshold: LeafType;
    left?: TreeNode;
    right?: TreeNode;
    value: LeafType;

    static newLeafNode(value: LeafType): TreeNode {
        const leaf = new TreeNode();
        leaf.value = value;
        return leaf;
    }
}