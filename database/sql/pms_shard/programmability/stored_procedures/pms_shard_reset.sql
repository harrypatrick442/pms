Alter Procedure [dbo].[pms_shard_reset]
AS
BEGIN
create table #tempPmsTablesToDelete(
	[tableName] varchar(100)
)
declare @id int;
declare @tableName varchar(100);

while(1=1)
begin
	if((select count(*) from tblHorizontalPartitions)<1)break;
	select top(1) @id = [id], @tableName = [tableName] from tblHorizontalPartitions;
	declare @strDeleteTable  nvarchar(max) = 'drop table '+@tableName+';';
	select @strDeleteTable;
	exec sp_executesql @strDeleteTable;
	delete from tblHorizontalPartitions where [id]=@id;
END
end;
