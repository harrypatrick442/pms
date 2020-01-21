Alter Function pms_shard_pms_tblPmsX_select_get (@tableName varchar(100), @temporaryTableNamePms varchar(100))
RETURNS varchar(max)
AS
BEGIN
declare @str varchar(max) ='insert into '+
@temporaryTableNamePms +'([userIdHighest], [userIdLowest], [content], [sentAt], [from],[clientAssignedUuid]) select top(@nLeft)
 [userIdHighest], [userIdLowest], [content], [sentAt], [from], [clientAssignedUuid] from  '
+@tableName+' where (@insertedFromInclusive is null or '
+@tableName+'.[insertedAt] >= @insertedFromInclusive )and (@insertedToExclusive is null or '
+@tableName+'.[insertedAt] < @insertedToExclusive) and '
+@tableName+'.[userIdLowest] = @userIdLowest and '
+@tableName+'.[userIdHighest] = @userIdHighest and ( @fromInclusive is null or '
+@tableName+'.[sentAt] >= @fromInclusive )and (@toExclusive is null or '
+@tableName+'.[sentAt] < @toExclusive) order by [sentAt] desc ';
return @str;
END

