Alter Function pms_shard_pms_tblPmsX_select_get (@tableName varchar(100), @temporaryTableNamePms varchar(100))
RETURNS varchar(max)
AS
BEGIN
declare @str varchar(max) ='insert into '+
@temporaryTableNamePms +'([userIdHighest], [userIdLowest], [content], [sentAt], [from]) select 
 [userIdHighest], [userIdLowest], [content], [sentAt], [from] from '
+@tableName+' where '
+@tableName+'.[insertedAt] >= @insertedFromInclusive and '
+@tableName+'.[insertedAt] < @insertedToExclusive and '
+@tableName+'.[userIdLowest] = @userIdLowest and '
+@tableName+'.[userIdHighest] = @userIdHighest and '
+@tableName+'.[sentAt] >= @fromInclusive and '
+@tableName+'.[sentAt] < @toExclusive';
return @str;
END

