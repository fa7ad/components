// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { TableBodyCell } from '../../../lib/components/table/body-cell';
import { TableProps } from '../interfaces';

const testItem = {
  test: 'test',
};

const column: TableProps.ColumnDefinition<typeof testItem, string> = {
  id: 'test',
  header: 'Test',
  editConfig: {
    ariaLabel: 'test input',
    editIconAriaLabel: 'error',
  },
  cell: (item, { isEditing, setValue, currentValue }) => {
    if (isEditing) {
      return <input type="text" value={currentValue ?? item.test} onChange={e => setValue(e.target.value)} />;
    }
    return item.test;
  },
};

const onEditEnd = jest.fn();
const onEditStart = jest.fn();

const TestComponent = ({ isEditing = false }) => {
  return (
    <table>
      <tbody>
        <tr>
          <TableBodyCell<typeof testItem, string>
            column={column}
            item={testItem}
            isEditing={isEditing}
            onEditStart={onEditStart}
            onEditEnd={onEditEnd}
            ariaLabels={{
              activateEditLabel: () => 'activate edit',
              cancelEditLabel: () => 'cancel edit',
              submitEditLabel: () => 'submit edit',
            }}
            isEditable={true}
            isPrevSelected={false}
            isNextSelected={false}
            isFirstRow={true}
            isLastRow={true}
            isSelected={false}
            wrapLines={false}
          />
        </tr>
      </tbody>
    </table>
  );
};

describe('TableBodyCell', () => {
  it('should render', () => {
    const { container } = render(<TestComponent />);
    expect(container).toMatchSnapshot();
  });

  it('should call onEditStart', () => {
    render(<TestComponent />);
    fireEvent.click(screen.getByRole('button', { name: 'activate edit' }));
    expect(onEditStart).toHaveBeenCalled();
  });

  it('should call onEditEnd', () => {
    render(<TestComponent isEditing={true} />);
    fireEvent.click(screen.getByRole('button', { name: 'submit edit' }));
    expect(onEditEnd).toHaveBeenCalled();
  });

  it('should call onEditEnd with value', () => {
    const { container } = render(<TestComponent isEditing={true} />);
    fireEvent.change(container.querySelector('input')!, { target: { value: 'test2' } });
    fireEvent.click(screen.getByRole('button', { name: 'submit edit' }));
    expect(onEditEnd).toHaveBeenCalled();
  });

  it('should call onEditEnd with value', () => {
    const { container } = render(<TestComponent isEditing={true} />);
    fireEvent.change(container.querySelector('input')!, { target: { value: 'test2' } });
    fireEvent.click(screen.getByRole('button', { name: 'cancel edit' }));
    expect(onEditEnd).toHaveBeenCalled();
  });
});
