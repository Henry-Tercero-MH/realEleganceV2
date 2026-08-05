/**
 * Design system de Real Elegance.
 *
 * Regla de oro: estos componentes son los **únicos** que definen color, radio,
 * sombra y espaciado, y todos lo hacen leyendo `tokens.css`. Si una pantalla
 * necesita algo que no está aquí, se añade aquí — no se improvisa en la página.
 */
export { Badge, OrderStatusBadge, StageBadge } from './Badge';
export type { BadgeProps, BadgeTone } from './Badge';

export { Button, ButtonLink } from './Button';
export type { ButtonProps, ButtonLinkProps, ButtonSize, ButtonVariant } from './Button';

export { Card } from './Card';
export type { CardProps } from './Card';

export { Checkbox } from './Checkbox';
export type { CheckboxProps } from './Checkbox';

export { Drawer } from './Drawer';
export type { DrawerProps } from './Drawer';

export { EmptyState } from './EmptyState';
export type { EmptyStateProps } from './EmptyState';

export { Field, describedBy } from './Field';
export type { FieldProps } from './Field';

export { Icon } from './Icon';
export type { IconName, IconProps } from './Icon';

export { IconButton } from './IconButton';
export type { IconButtonProps } from './IconButton';

export { Input } from './Input';
export type { InputProps } from './Input';

export { Modal } from './Modal';
export type { ModalProps } from './Modal';

export { OptionCard } from './OptionCard';
export type { OptionCardProps } from './OptionCard';

export { Price } from './Price';
export type { PriceProps } from './Price';

export { QuantityStepper } from './QuantityStepper';
export type { QuantityStepperProps } from './QuantityStepper';

export { Rule, SectionHeading } from './SectionHeading';
export type { RuleProps, SectionHeadingProps } from './SectionHeading';

export { Select } from './Select';
export type { SelectOption, SelectProps } from './Select';

export { Skeleton, SkeletonCard, SkeletonText } from './Skeleton';
export type { SkeletonProps } from './Skeleton';

export { Spinner } from './Spinner';
export type { SpinnerProps } from './Spinner';

export { Stepper } from './Stepper';
export type { StepperProps, StepperStep } from './Stepper';

export { Table } from './Table';
export type { Column, TableProps } from './Table';

export { Tabs } from './Tabs';
export type { TabItem, TabsProps } from './Tabs';

export { Textarea } from './Textarea';
export type { TextareaProps } from './Textarea';

export { Toast, ToastViewport } from './Toast';
export type { ToastData, ToastProps, ToastTone } from './Toast';
