'use client';

import { useSize } from 'ahooks';
import { ChevronDown, ChevronUp } from 'lucide-react';
import {
  FC,
  PropsWithChildren,
  ReactNode,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Flexbox } from 'react-layout-kit';

import ActionIcon from '@/ActionIcon';
import ChatInputAreaInner from '@/chat/ChatInputArea/components/ChatInputAreaInner';
import SafeArea from '@/mobile/SafeArea';

import { useStyles } from './style';
import type { ChatInputAreaProps } from './type';

const ChatInputArea = memo<ChatInputAreaProps>(
  ({
    ref,
    className,
    style,
    topAddons,
    textAreaLeftAddons,
    textAreaRightAddons,
    bottomAddons,
    expand = false,
    setExpand,
    onSend,
    onInput,
    loading,
    value,
    safeArea,
  }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { cx, styles } = useStyles();
    const size = useSize(containerRef);
    const [showFullscreen, setShowFullscreen] = useState<boolean>(false);
    const [isFocused, setIsFocused] = useState<boolean>(false);

    useEffect(() => {
      if (!size?.height) return;
      setShowFullscreen(size.height > 72);
    }, [size]);

    const InnerContainer: FC<
      PropsWithChildren & {
        bottomAddons?: ReactNode;
        textAreaLeftAddons?: ReactNode;
        textAreaRightAddons?: ReactNode;
        topAddons?: ReactNode;
      }
    > = useCallback(
      ({ children, ...r }) =>
        expand ? (
          <Flexbox className={styles.inner} gap={8}>
            <Flexbox gap={8} horizontal justify={'flex-end'}>
              {r.textAreaLeftAddons}
              {r.textAreaRightAddons}
            </Flexbox>
            {children}
            {r.topAddons}
            {r.bottomAddons}
          </Flexbox>
        ) : (
          <Flexbox align={'flex-end'} className={styles.inner} gap={8} horizontal>
            {r.textAreaLeftAddons}
            {children}
            {r.textAreaRightAddons}
          </Flexbox>
        ),
      [expand, loading],
    );

    const showAddons = !expand && !isFocused;

    return (
      <Flexbox
        className={cx(styles.container, expand && styles.expand, className)}
        gap={12}
        style={style}
      >
        {topAddons && <Flexbox style={showAddons ? {} : { display: 'none' }}>{topAddons}</Flexbox>}
        <Flexbox
          className={cx(expand && styles.expand)}
          ref={containerRef}
          style={{ position: 'relative' }}
        >
          {showFullscreen && (
            <ActionIcon
              active
              className={styles.expandButton}
              icon={expand ? ChevronDown : ChevronUp}
              id={'sssssss'}
              onClick={() => setExpand?.(!expand)}
              size={{ blockSize: 24, borderRadius: '50%', size: 14 }}
              style={expand ? { top: 6 } : {}}
            />
          )}
          <InnerContainer
            bottomAddons={bottomAddons}
            textAreaLeftAddons={textAreaLeftAddons}
            textAreaRightAddons={textAreaRightAddons}
            topAddons={topAddons}
          >
            <ChatInputAreaInner
              autoSize={expand ? false : { maxRows: 6, minRows: 1 }}
              className={styles.expandTextArea}
              loading={loading}
              onBlur={() => setIsFocused(false)}
              onFocus={() => setIsFocused(true)}
              onInput={onInput}
              onSend={onSend}
              ref={ref}
              style={{ height: 36, paddingBlock: 6 }}
              value={value}
              variant={expand ? 'borderless' : 'filled'}
            />
          </InnerContainer>
        </Flexbox>
        {bottomAddons && (
          <Flexbox style={showAddons ? {} : { display: 'none' }}>{bottomAddons}</Flexbox>
        )}
        {safeArea && !isFocused && <SafeArea position={'bottom'} />}
      </Flexbox>
    );
  },
);

ChatInputArea.displayName = 'ChatInputArea';

export default ChatInputArea;
