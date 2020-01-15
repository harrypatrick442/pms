Alter Procedure [dbo].[pms_shard_pms_add_update]
AS
BEGIN
	declare @str nvarchar(max)='';
	declare @tableName varchar(100);
	select top(1) @tableName = [tableName] from tblHorizontalPartitions where tblHorizontalPartitions.[from]>=GETDATE() order by [id] asc;
	set @str+='IF EXISTS (
        SELECT type_desc, type
        FROM sys.procedures WITH(NOLOCK)
        WHERE NAME = ''pms_shard_pms_add''
            AND type = ''P''
      )
     DROP PROCEDURE dbo.pms_shard_pms_add';
exec sp_executesql @str;
	  set @str = '
Alter Procedure pms_shard_pms_add(
@pms Pms readonly
)
AS
BEGIN
	declare @now datetime = GETDATE();
	insert into '+@tableName+'([userIdHighest], [userIdLowest], [sentAt], [insertedAt], [from], [content]) 
	select 
	(case when userIdFrom < userIdTo then userIdTo else userIdFrom end), 
	(case when userIdFrom > userIdTo then userIdTo else userIdFrom end),
	pms.[sentAt],
	@now, 
	userIdFrom,
	pms.[content]
	from @pms pms;
END';
exec sp_executesql @str;
END
