/**
 * 重渲染防抖 hook
 */
import { useRef, useEffect, useReducer } from 'react';

/**
 * 监听依赖，当依赖变化时触发重渲染防抖，返回值用于判断是否显示重渲染的节点
 * @param dependency 依赖（如果是引用数据类型，需要注意数据不变时保持引用不变）
 * @param wait 等待时间（毫秒，默认值 500）
 * @returns 是否渲染
 */
function useDebounceRerender<T>(dependency: T, wait: number = 500): boolean {
  const [, forcedToRender] = useReducer((x) => x + 1, 0);
  const dependencyRef = useRef(dependency);

  let triggered = false;
  if (dependency !== dependencyRef.current) {
    triggered = true;
  }
  dependencyRef.current = dependency;

  const visibleRef = useRef(true);
  if (triggered) {
    visibleRef.current = false;
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (visibleRef.current === false) {
        visibleRef.current = true;
        forcedToRender();
      }
    }, wait);
    return () => {
      clearTimeout(timer);
    };
  });

  return visibleRef.current;
}

export default useDebounceRerender;
