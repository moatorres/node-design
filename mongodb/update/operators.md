### MongoDB - Update Operators

###### Fields

| Name     | Description |
| :------ | :---------- |
| [`$currentDate`]('./current-date.md') | Sets the value of a field to current date, either as a Date or a Timestamp
| [`$inc`]() | Increments the value of the field by the specified amount
| [`$min`]() | Only updates the field if the specified value is less than the existing field value
| [`$max`]() | Only updates the field if the specified value is greater than the existing field value
| [`$mul`]() | Multiplies the value of the field by the specified amount
| [`$rename`]() | Renames a field
| [`$set`]() | Sets the value of a field in a document
| [`$setOnInsert`]() | Sets the value of a field if an update results in an insert of a document. Has no effect on update operations that modify existing documents.
| [`$unset`]() | Removes the specified field from a document

###### Array

| Name     | Description |
| :------ | :---------- |
| [`$`]() | Acts as a placeholder to update the first element that matches the query condition
| [`$[]`]() | Acts as a placeholder to update all elements in an array for the documents that match the query condition.
| [`$[<identifier>]`]() | Acts as a placeholder to update all elements that match the *arrayFilters* condition for the documents that match the query condition
| [`$addToSet`]() | Adds elements to an array only if they do not already exist in the set
| [`$pop`]() | Removes the first or last item of an array.
| [`$pull`]() | Removes all array elements that match a specified query
| [`$push`]() | Adds an item to an array
| [`$pullAll`]() | Removes all matching values from an array

###### Modifiers

| Name     | Description |
| :------ | :---------- |
| [`$each`]() | Modifies the `$push` and `$addToSet` operators to append multiple items for array updates
| [`$position`]() | Modifies the `$push` operator to specify the position in the array to add elements
| [`$slice`]() | Modifies the `$push` operator to limit the size of updated arrays
| [`$sort`]() | Modifies the `$push` operator to reorder documents stored in an array

###### Bitwise

| Name     | Description |
| :------ | :---------- |
| [`$bit`]() | Performs bitwise AND, OR, and XOR updates of integer values

