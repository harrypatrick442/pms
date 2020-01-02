Alter Procedure [dbo].[pms_shard_pms_get_update]
AS
BEGIN
	declare @str nvarchar(max)='';
	set @str+='IF EXISTS (
        SELECT type_desc, type
        FROM sys.procedures WITH(NOLOCK)
        WHERE NAME = ''pms_shard_pms_get''
            AND type = ''P''
      )
     DROP PROCEDURE dbo.pms_shard_pms_get';
exec sp_executesql @str;
	set @str='
			Alter Procedure pms_shard_pms_get(
 @userId1 int,
 @userId2 int,
 @fromInclusive datetime,
 @toExclusive datetime = null
)
AS
BEGIN
	create table #tempPms(
	[userIdHighest] int, [userIdLowest] int, [content] text, [sentAt] datetime, [from] int
	);
	declare @userIdHighest int;
	declare @userIdLowest int;
	if(@userId1 > @userId2)
	begin
	set @userIdHighest  =   @userId1;
	set @userIdLowest  =@userId2;
	end 
	else
	begin
	set @userIdHighest  =   @userId2;
	set @userIdLowest  =@userId1;
	end
	declare @insertedFromInclusive datetime = DATEADD(MINUTE,-2,@fromInclusive);
	declare @insertedToExclusive datetime =@toExclusive;';
	
	
	set @str +=STUFF((
        select 
            'if(@insertedToExclusive > CAST('''
			+convert(varchar(25), tblHorizontalPartitions.[from], 120)+'''as datetime))
			 begin 
			 '+
			dbo.pms_shard_pms_tblPmsX_select_get(tblHorizontalPartitions.[tableName], '#tempPms')+
	' end
	 if(@insertedFromInclusive >= CAST('''+convert(varchar(25), tblHorizontalPartitions.[from], 120)+'''as datetime))
	 begin
	  return;
	 end;'
        from tblHorizontalPartitions
        for xml path(''), type
    ).value('.', 'varchar(max)'), 1, 0, '') ;

	set @str+='
	select [content] as /*<S_CONTENT>*/''content''/*<S_CONTENT>*/,
	[sentAt] as /*<S_SENT_AT>*/''sentAt''/*<S_SENT_AT>*/, 
	[from] as /*<S_FROM>*/''from''/*<S_FROM>*/ from #tempPms;
END';
exec sp_executesql @str;
END