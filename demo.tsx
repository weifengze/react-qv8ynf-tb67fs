import React, { useState, useEffect } from 'react';
import './index.css';
import { Tree, Button } from 'antd';
import type { TreeDataNode, TreeProps } from 'antd';

const treeData: TreeDataNode[] = [
  {
    title: '0-0',
    key: '0-0',
    children: [
      {
        title: '0-0-0',
        key: '0-0-0',
        children: [
          { title: '0-0-0-0', key: '0-0-0-0' },
          { title: '0-0-0-1', key: '0-0-0-1' },
          { title: '0-0-0-2', key: '0-0-0-2' },
        ],
      },
      {
        title: '0-0-1',
        key: '0-0-1',
        children: [
          { title: '0-0-1-0', key: '0-0-1-0' },
          { title: '0-0-1-1', key: '0-0-1-1' },
          { title: '0-0-1-2', key: '0-0-1-2' },
        ],
      },
      {
        title: '0-0-2',
        key: '0-0-2',
      },
    ],
  },
  {
    title: '0-1',
    key: '0-1',
    children: [
      { title: '0-1-0-0', key: '0-1-0-0' },
      { title: '0-1-0-1', key: '0-1-0-1' },
      { title: '0-1-0-2', key: '0-1-0-2' },
    ],
  },
  {
    title: '0-2',
    key: '0-2',
  },
];

const App: React.FC = () => {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([
    '0-0-0',
    '0-0-1',
  ]);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([
    '0-0-0',
    '0-0-1',
    '0-0-2',
  ]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

  const getAllCheckedKeys = (keys: React.Key[]) => {
    const allKeys: React.Key[] = [...keys];

    const findKeys = (nodes: TreeDataNode[]): React.Key[] => {
      let keysToAdd: React.Key[] = [];
      for (const node of nodes) {
        // 如果当前节点的 key 在 checkedKeys 中，添加该节点的 key 和其所有子节点的 key
        if (keys.includes(node.key)) {
          keysToAdd.push(node.key);
          if (node.children) {
            const childKeys = node.children.map((child) => child.key);
            keysToAdd.push(...childKeys);
          }
        } else if (node.children) {
          // 如果子节点中有选中的节点，添加当前节点的 key
          const isChildSelected = node.children.some((child) =>
            keys.includes(child.key)
          );
          if (isChildSelected && !keysToAdd.includes(node.key)) {
            keysToAdd.push(node.key);
          }
        }
        // 递归查找
        keysToAdd.push(...findKeys(node.children || []));
      }
      return keysToAdd;
    };

    allKeys.push(...findKeys(treeData));
    return Array.from(new Set(allKeys)); // 去重
  };

  // 在checkedKeys变化时输出
  useEffect(() => {
    console.log('checkedKeysValue:', checkedKeys);
  }, [checkedKeys]);

  const onExpand: TreeProps['onExpand'] = (expandedKeysValue) => {
    console.log('onExpand', expandedKeysValue);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onCheck: TreeProps['onCheck'] = (checkedKeysValue) => {
    const newCheckedKeys = getAllCheckedKeys(checkedKeysValue as React.Key[]);
    console.log('onCheck', newCheckedKeys);
    setCheckedKeys(newCheckedKeys as React.Key[]);
  };

  const onSelect: TreeProps['onSelect'] = (selectedKeysValue, info) => {
    console.log('onSelect', info);
    setSelectedKeys(selectedKeysValue);
  };

  const handleGetCheckedKeys = () => {
    // console.log('所有选中的节点 key:', checkedKeys);
    // alert(`所有选中的节点 key: ${checkedKeys.join(', ')}`);
    const allCheckedKeys = getAllCheckedKeys(checkedKeys).sort();
    console.log('所有选中的节点 key:', allCheckedKeys);
    alert(`所有选中的节点 key: ${allCheckedKeys.join(', ')}`);
  };

  return (
    <div>
      <Tree
        checkable
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        onCheck={onCheck}
        checkedKeys={checkedKeys}
        onSelect={onSelect}
        selectedKeys={selectedKeys}
        treeData={treeData}
      />
      <Button onClick={handleGetCheckedKeys} style={{ marginTop: 16 }}>
        获取所有选中的节点 key
      </Button>
    </div>
  );
};

export default App;
