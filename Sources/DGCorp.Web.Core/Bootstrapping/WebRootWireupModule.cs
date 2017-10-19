using System.Reflection;
using Autofac;
using Autofac.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection;

namespace DGCorp.Web.Core.Bootstrapping
{
    public interface IDetermineServicesAssembly
    {
    }

    public class WebRootWireupModule : Autofac.Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            base.Load(builder);
            //builder.RegisterAssemblyTypes(typeof(IDetermineServicesAssembly).GetTypeInfo().Assembly).AsImplementedInterfaces();
            
            builder.RegisterType<Executor>().As<IExecutor>();
        }
    }

    //----------------------------------

    public interface IExecutor
    {
        string Execute();
    }
    
    public class Executor : IExecutor
    {
        public string Execute() => "Executing runned";
    }

    //----------------------------------
}