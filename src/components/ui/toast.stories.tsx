import type { Meta, StoryObj } from 'storybook'
import { Button } from './button'
import {
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastRoot,
  ToastTitle,
  ToastViewport,
  useToastManager,
} from './toast'

function ToastDemo() {
  const manager = useToastManager()

  return (
    <>
      <Button
        variant="outline"
        onClick={() => {
          manager.add({
            title: 'Hello!',
            description: 'This is a toast notification.',
          })
        }}
      >
        Show Toast
      </Button>
      <ToastViewport>
        {manager.toasts.map((toast) => (
          <ToastRoot key={toast.id} toast={toast}>
            <div className="flex flex-col gap-1">
              <ToastTitle>{String(toast.title)}</ToastTitle>
              <ToastDescription>{String(toast.description)}</ToastDescription>
            </div>
            <ToastClose />
          </ToastRoot>
        ))}
      </ToastViewport>
    </>
  )
}

function ToastStory() {
  return (
    <ToastProvider>
      <ToastDemo />
    </ToastProvider>
  )
}

const meta: Meta<typeof ToastRoot> = {
  title: 'Complex/Toast',
  component: ToastRoot,
}

export default meta
type Story = StoryObj<typeof ToastRoot>

export const Default: Story = {
  render: () => <ToastStory />,
}
